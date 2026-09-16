const assert=require('assert');
const fs=require('fs');
const path=require('path');
const U=require('../listing-utils.js');
const E=require('../outcome-engine.js');
const demo=require('../data/inventory.demo.json');

// Dealer distribution must happen before pagination: a six-listing page should mix 3 demo providers.
for(const type of ['automotive','property','fine_jewellery']){
  const list=demo.filter(x=>x.assetType===type);
  const pages=U.distributedPages(list,6);
  assert.strictEqual(pages.length,1);
  assert.strictEqual(pages[0].length,6);
  assert.strictEqual(new Set(pages[0].map(x=>x.dealer||x.agent||x.jeweller)).size,3);
  assert.ok(Math.max(...U.dealerMix(pages[0]).map(x=>x.count))<=2);
}

// Property finance must include transfer/bond costs in financed principal when supplied.
const property=E.customerOutcome({assetType:'property',modules:{asset:true,automotive:true,finance:true,insurance:false},price:2000000,transferCosts:60000,bondRegistration:25000,deposit:200000,rate:10,term:60,horizon:60,futureValue:2200000,saleCosts:100000,ratesMonthly:3000,leviesMonthly:2000,propertyMaintenanceMonthly:1000,utilitiesMonthly:1000,rentalIncomeMonthly:0});
assert.strictEqual(property.finance.financed,1885000);
assert(Math.abs(property.economicCost-(property.cashOutflowHorizon-property.netEquity))<0.001);

// Jewellery valuation is evidence about current value; it must not silently become future exit value.
const jewellery=E.customerOutcome({assetType:'fine_jewellery',modules:{asset:true,automotive:true,finance:false,insurance:false},price:100000,valuation:110000,horizon:60});
assert.strictEqual(jewellery.assetValue,null);
assert(jewellery.evidence.some(x=>x.label==='future/exit asset value'&&x.status==='MISSING'));

// Layout contract: 6 listings + 2 woven ads and no permanent sidebar.
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'..','styles.css'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(html.includes('Property')&&html.includes('Fine Jewellery'));
assert(html.includes('calcTransferCosts')&&html.includes('calcValuation'));
assert(app.includes('Row 1: 3 listings + 1 ad. Row 2: 1 ad + 3 listings.'));
assert(css.includes('#vehicleResults{display:grid!important;grid-template-columns:repeat(4'));
assert(css.includes('.master-sidebar{display:none!important}'));

console.log('VECTORI 2.2 platform integration tests: PASS');
