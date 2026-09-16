const assert = require('assert');
const E = require('../outcome-engine.js');
const U = require('../listing-utils.js');

const prices=[75000,150000,350000,900000];
const rates=[0,7.5,12.5,19.5];
const terms=[12,36,72,84];
let financeCases=0;
for(const price of prices) for(const rate of rates) for(const term of terms){
  const r=E.customerOutcome({assetType:'automotive',modules:{automotive:true,finance:true,insurance:true},price,rate,term,balloonPct:0,deposit:Math.min(30000,price*.1),monthlyKm:1500,fuelPrice:25,consumption:7,maintenancePerKm:.6,premiumMonthly:1500,horizon:Math.min(60,term),futureValue:price*.55});
  assert(Number.isFinite(r.cashOutflowHorizon) && r.cashOutflowHorizon>=0);
  assert(Number.isFinite(r.monthlyCashOutflow) && r.monthlyCashOutflow>=0);
  assert(Math.abs(r.economicCost-(r.cashOutflowHorizon-r.netEquity))<0.001);
  financeCases++;
}

let propertyCases=0;
for(const price of prices) for(const rate of rates) for(const term of [24,60]){
  const r=E.customerOutcome({assetType:'property',modules:{automotive:true,finance:true,insurance:true},price,rate,term,balloonPct:0,deposit:price*.1,transferCosts:price*.03,bondRegistration:10000,ratesMonthly:2200,leviesMonthly:1800,propertyMaintenanceMonthly:1000,utilitiesMonthly:1200,propertyInsuranceMonthly:600,premiumMonthly:600,horizon:Math.min(60,term),futureValue:price*1.08,saleCosts:price*.05});
  assert(Number.isFinite(r.cashOutflowHorizon) && r.cashOutflowHorizon>=0);
  propertyCases++;
}

let jewelleryCases=0;
for(const price of prices) for(const rate of rates) for(const term of [12,36,60]){
  const r=E.customerOutcome({assetType:'fine_jewellery',modules:{automotive:true,finance:true,insurance:true},price,rate,term,deposit:price*.2,balloonPct:0,premiumMonthly:100, jewelleryInsuranceMonthly:100,storageMonthly:25,horizon:Math.min(60,term),futureValue:price*.95,resaleCosts:price*.03});
  assert(Number.isFinite(r.cashOutflowHorizon) && r.cashOutflowHorizon>=0);
  jewelleryCases++;
}

const scenarios=[
  Array.from({length:6},(_,i)=>({id:i,dealer:i<6?'A':'B'})),
  [{dealer:'A'},{dealer:'A'},{dealer:'B'},{dealer:'B'},{dealer:'C'},{dealer:'C'}],
  [{dealer:'A'},{dealer:'A'},{dealer:'A'},{dealer:'B'},{dealer:'B'},{dealer:'C'}]
];
for(const list of scenarios){
  const page=U.diversifyByDealer(list,6);
  const audit=U.distributionAudit(page,6);
  if(audit.distinctDealers>1) assert(audit.maximumListingsFromOneDealer<6);
}

console.log(JSON.stringify({status:'PASS',financeCases,propertyCases,jewelleryCases,dealerDistributionScenarios:scenarios.length},null,2));

const demo = require('../data/inventory.demo.json');
for (const type of ['automotive','property','fine_jewellery']) {
  const filtered = demo.filter(x => x.assetType === type);
  const page = U.diversifyByDealer(filtered, 6);
  const audit = U.distributionAudit(page, 6);
  assert.strictEqual(page.length, 6);
  assert.strictEqual(audit.distinctDealers, 3);
  assert.strictEqual(audit.maximumListingsFromOneDealer, 2);
}
console.log('VECTORI demo multi-dealer/category simulation: PASS');
