const assert=require('assert');
const E=require('../outcome-engine.js');
const approx=(a,b,t=0.01)=>assert(Math.abs(a-b)<=t,`Expected ${a} ≈ ${b}`);

// PMT zero rate
approx(E.pmt(0,12,12000,0),1000);
// Standard amortisation: R100k, 12%, 12m
const f=E.financeScenario({price:100000,deposit:0,rate:12,term:12,balloonPct:0,monthlyFee:0,initiationFee:0,horizon:12});
approx(f.monthlyPayment,8884.88,0.02);
assert(f.balanceAtHorizon < 0.01);
// Balloon changes payment but remains an obligation
const b=E.financeScenario({price:100000,deposit:0,rate:12,term:12,balloonPct:30,horizon:12});
assert(b.monthlyPayment < f.monthlyPayment);
approx(b.balanceAtHorizon,30000,0.01);
// Combined outcome identity: economic cost = cash outflow - net equity
const r=E.customerOutcome({modules:{automotive:true,finance:true,insurance:true},price:300000,tradeIn:0,deposit:30000,rate:12,term:60,balloonPct:0,monthlyFee:69,initiationFee:1200,monthlyKm:1500,fuelPrice:25,consumption:7,maintenancePerKm:0.7,tyreCost:6000,tyreLife:50000,licenceAnnual:1800,premiumMonthly:1500,horizon:60,futureValue:150000,income:40000,existingDebt:3000,livingCosts:18000});
approx(r.economicCost,r.cashOutflowHorizon-r.netEquity,0.01);
assert(r.cashOutflowHorizon>0);
assert(E.validateResult(r).ok);
// Missing evidence is surfaced, not fabricated
const m=E.customerOutcome({modules:{automotive:true,finance:true,insurance:true},price:300000,rate:12,term:60,monthlyKm:1500});
assert(m.evidence.some(x=>x.status==='MISSING'));
console.log('VECTORI outcome engine tests: PASS');

// Property checks across a grid of prices/rates/terms: finite, non-negative payment and identity.
for (const price of [75000,150000,350000,900000]) {
  for (const rate of [0,7.5,12.5,19.5]) {
    for (const term of [12,36,72,84]) {
      const x=E.financeScenario({price,rate,term,deposit:0,balloonPct:0,horizon:term});
      assert(Number.isFinite(x.monthlyPayment) && x.monthlyPayment>=0);
      assert(x.balanceAtHorizon < 0.02);
    }
  }
}
// Combined modules are additive at cash-flow level.
const base={price:250000,deposit:25000,rate:11,term:60,balloonPct:0,monthlyFee:50,monthlyKm:1200,fuelPrice:25,consumption:7,maintenancePerKm:.5,tyreCost:5000,tyreLife:50000,licenceAnnual:1800,premiumMonthly:1300,horizon:60,futureValue:130000};
const a=E.customerOutcome({...base,modules:{automotive:true,finance:false,insurance:false}});
const f2=E.customerOutcome({...base,modules:{automotive:false,finance:true,insurance:false}});
const i2=E.customerOutcome({...base,modules:{automotive:false,finance:false,insurance:true}});
const all=E.customerOutcome({...base,modules:{automotive:true,finance:true,insurance:true}});
const expectedCombined=f2.cashOutflowHorizon+(a.automotive.operatingMonthly*base.horizon)+i2.cashOutflowHorizon;
approx(all.cashOutflowHorizon,expectedCombined,0.01);
console.log('VECTORI property grid: PASS');

const property = E.customerOutcome({
  assetType:'property', modules:{automotive:true,finance:false,insurance:true},
  price:1000000, transferCosts:40000, bondRegistration:25000,
  ratesMonthly:2500, leviesMonthly:1800, propertyMaintenanceMonthly:1000,
  utilitiesMonthly:1200, propertyInsuranceMonthly:500, futureValue:1100000,
  saleCosts:55000, premiumMonthly:500, horizon:60
});
assert.strictEqual(property.assetType, 'property');
assert.ok(property.property);
assert.strictEqual(property.cashOutflowHorizon, property.property.acquisitionCash + (property.property.operatingMonthly + property.insurance.monthly) * 60);

const jewellery = E.customerOutcome({
  assetType:'fine_jewellery', modules:{automotive:true,finance:false,insurance:true},
  price:50000, valuation:60000, jewelleryInsuranceMonthly:150,
  storageMonthly:50, futureValue:58000, resaleCosts:3000,
  premiumMonthly:150, horizon:60
});
assert.strictEqual(jewellery.assetType, 'fine_jewellery');
assert.ok(jewellery.jewellery);
assert.ok(Number.isFinite(jewellery.economicCost));
console.log('VECTORI multi-asset outcome tests: PASS');
