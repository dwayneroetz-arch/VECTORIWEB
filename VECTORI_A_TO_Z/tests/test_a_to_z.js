const assert=require('assert');
const e=require('../purchase-engine');
const finance=require('../finance-data.json');
const insurance=require('../insurance-data.json');

// Core mathematical regression
const r=e.financeScenario({price:244850,deposit:30000,tradeIn:0,rate:12.5,term:72,balloonPct:0,adminFee:69,initiationFee:0,creditLifePerR1000:0},{provider:'Test',name:'ISA'});
assert(Math.abs(r.payment-4256.43)<1,'PMT regression failed');
assert(r.balloon===0,'Zero balloon failed');
const rb=e.financeScenario({price:244850,deposit:30000,rate:12.5,term:72,balloonPct:35,adminFee:69,initiationFee:0,creditLifePerR1000:0},{provider:'Ford Credit',name:'Balloon'});
assert(rb.payment<r.payment,'Balloon should reduce instalment');
const high=e.totalOwnership({price:244850,consumption:4.4,monthlyKm:1500,fuelPrice:32,maintenancePerKm:.8,tyreSetCost:5000,tyreLife:50000,licenceAnnual:1800,futureValue:145000,horizon:60,grossIncome:35000,otherDebt:3000,livingCosts:18000,otherVehicleCosts:0},r,{premium:1200});
const low=e.totalOwnership({price:244850,consumption:4.4,monthlyKm:1500,fuelPrice:26.92,maintenancePerKm:.8,tyreSetCost:5000,tyreLife:50000,licenceAnnual:1800,futureValue:145000,horizon:60,grossIncome:35000,otherDebt:3000,livingCosts:18000,otherVehicleCosts:0},r,{premium:1200});
assert(high.cash>low.cash,'Fuel stress invariant failed');
assert(e.selectFinanceProducts(finance,{term:72,balloonPct:35}).length>0,'Finance provider dataset empty');
assert(e.selectInsuranceProducts(insurance).length>=5,'Insurance provider dataset incomplete');

// 10,000 randomized calculator scenarios: finite values and monotonicity.
let seed=123456789;function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<10000;i++){
  const price=75000+rnd()*900000, deposit=rnd()*Math.min(price*.5,150000), rate=5+rnd()*15, term=24+Math.floor(rnd()*49), balloon=rnd()*35;
  const a=e.financeScenario({price,deposit,rate,term,balloonPct:balloon,adminFee:69,initiationFee:0,creditLifePerR1000:0},{});
  const b=e.financeScenario({price,deposit,rate,term,balloonPct:0,adminFee:69,initiationFee:0,creditLifePerR1000:0},{});
  assert(Number.isFinite(a.payment)&&a.payment>=0,'Non-finite finance output');
  assert(a.payment<=b.payment+1e-8,'Balloon monotonicity failed');
  assert(Number.isFinite(a.totalCost),'Non-finite total cost');
}
console.log('PASS: VECTORI A-to-Z engine regression + 10,000 randomized scenarios');
