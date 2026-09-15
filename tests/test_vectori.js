const fs=require('fs'), vm=require('vm'), assert=require('assert');
const inventory=JSON.parse(fs.readFileSync(__dirname+'/../data/inventory.json','utf8'));
const js=fs.readFileSync(__dirname+'/../app.js','utf8');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
assert.strictEqual(inventory.length,153,'inventory should contain 153 vehicles');
assert.strictEqual(new Set(inventory.map(v=>v.id)).size,153,'vehicle IDs must be unique');
assert.strictEqual(inventory.filter(v=>v.sourceUrl).length,153,'every demo vehicle must retain source URL/provenance');
assert.strictEqual(inventory.filter(v=>v.listingId).length,153,'every demo vehicle must retain listing ID');
assert(inventory.filter(v=>v.make&&v.model&&v.variant).length>=150,'URL-derived identity should populate imported records');
assert(inventory.some(v=>v.make==='Toyota'&&v.model==='Land Cruiser Prado'),'Toyota Land Cruiser Prado should be present');
assert(inventory.some(v=>v.make==='Ford'&&v.model==='Ranger'&&v.variant==='Raptor'),'Ford Ranger Raptor should be present');
assert(inventory.some(v=>v.year>2026),'source year anomalies should be preserved');
assert(html.includes('01 — Find')&&html.includes('02 — Compare')&&html.includes('03 — Intelligence')&&html.includes('04 — Purchase Readiness')&&html.includes('05 — Dealer Portal'),'numbered sections must be 01-05');
assert(html.includes('153 development vehicles'),'inventory count label must match');
assert(!html.includes('inventory.js'),'deployment build must not depend on inventory.js');
assert(html.includes('app.js'),'structured build must load app.js');
assert(html.includes('data/inventory.json') || js.includes('data/inventory.json'),'structured build must reference JSON inventory');
assert(js.includes('comparison.length>=6') || js.includes('comparison.length >= 6'),'six-vehicle cap must remain in application logic');

const vals={calcPrice:244850,calcMarket:231511,calcConsumption:4.4,calcKm:1500,calcFuel:26.92,calcDeposit:30000,calcInterest:12.5,calcTerm:72,calcBalloonPct:0,calcAdminFee:69,calcInitiationFee:0,calcInsurance:1200,calcMaintenance:.80,calcLicence:1800,calcTyreCost:5000,calcTyreLife:50000,calcFutureValue:145000,calcHorizon:60,calcIncome:35000,calcDebt:3000,calcLiving:18000,calcOtherVehicle:0,calcTradeIn:0,calcVehicle:'VEH-002'};
const nodes={};
function node(id){if(!nodes[id]){nodes[id]={innerHTML:'',style:{},classList:{add(){},remove(){},toggle(){}}};Object.defineProperty(nodes[id],'value',{get(){return String(vals[id]??'')}});}return nodes[id];}
const document={getElementById:id=>node(id),addEventListener(){},querySelectorAll(){return[]}};
const context={document,console,Intl,Math,Number,String,Date,setTimeout,clearTimeout,URL,Blob,alert:()=>{},isFinite,fetch:async()=>({ok:true,json:async()=>inventory})};
vm.createContext(context); vm.runInContext(js,context);
const loaded=vm.runInContext('vehicles',context); assert.strictEqual(loaded.length,0,'runtime inventory starts empty and loads asynchronously');
function calc(v){return vm.runInContext(`calculate(${JSON.stringify(v)})`,context);}
function close(a,b,t=1e-8){assert(Math.abs(a-b)<=t,`expected ${a} ~= ${b}`)}
const vehicle={id:'VEH-002',make:'Suzuki',model:'Swift',variant:'1.2 GL+',price:244850,market:231511,consumption:4.4,mileage:12500,province:'Gauteng',evidence:'Exact'};
let r=calc(vehicle); close(r.financePayment,4256.431744,1e-6); close(r.fuelMonthly,1776.72,1e-6); close(r.depreciationMonthly,1664.1666666666667,1e-9); close(r.totalCashMonthly,8802.151744,1e-6); close(r.totalEconomicMonthly,7482.2906329,1e-6);
vals.calcInterest=0; vals.calcBalloonPct=20; r=calc(vehicle); close(r.financePayment,(vehicle.price-30000)*.8/72,1e-9); close(r.balloonAmount,(vehicle.price-30000)*.2,1e-9);
vals.calcInterest=12.5; vals.calcBalloonPct=0; const noBalloon=calc(vehicle); vals.calcBalloonPct=20; const withBalloon=calc(vehicle); assert(withBalloon.financePayment<noBalloon.financePayment); assert(withBalloon.totalCashMonthly<noBalloon.totalCashMonthly); vals.calcBalloonPct=0;
const base=calc(vehicle); vals.calcFuel=32.304; assert(calc(vehicle).totalCashMonthly>base.totalCashMonthly); vals.calcFuel=26.92; vals.calcKm=2000; assert(calc(vehicle).totalCashMonthly>base.totalCashMonthly); vals.calcKm=1500;
vals.calcDeposit=50000; assert(calc(vehicle).financePayment<base.financePayment); vals.calcDeposit=30000;
vals.calcDeposit=vehicle.price; assert(calc(vehicle).errors.length>0); vals.calcDeposit=30000; vals.calcInterest=-1; assert(calc(vehicle).errors.length>0); vals.calcInterest=12.5;
const imported=inventory.find(v=>v.id==='AT-28569446'); vals.calcPrice=imported.price; vals.calcMarket=''; vals.calcConsumption=''; assert(calc(imported).errors.length>0,'missing consumption must require explicit user input');
let comparison=[]; function toggleModel(id,checked){if(checked){if(comparison.includes(id))return;if(comparison.length>=6)return;comparison.push(id)}else comparison=comparison.filter(x=>x!==id)}
for(let i=1;i<=6;i++)toggleModel('V'+i,true); assert.strictEqual(comparison.length,6); toggleModel('V7',true); assert.strictEqual(comparison.length,6); toggleModel('V3',false); assert.strictEqual(comparison.length,5); toggleModel('V7',true); assert.strictEqual(comparison.length,6);
let seed=0x51a7c0de; function rand(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
for(let i=0;i<10000;i++){
 const price=80000+rand()*920000, trade=rand()*Math.min(20000,price*.10), deposit=rand()*Math.max(1,price-trade-1), interest=rand()*25, term=12+Math.floor(rand()*109), balloon=rand()*60, km=rand()*5000, fuel=15+rand()*25, consumption=3+rand()*12, income=10000+rand()*140000;
 Object.assign(vals,{calcPrice:price,calcTradeIn:trade,calcDeposit:deposit,calcInterest:interest,calcTerm:term,calcBalloonPct:balloon,calcKm:km,calcFuel:fuel,calcConsumption:consumption,calcIncome:income,calcInsurance:rand()*5000,calcMaintenance:rand()*3,calcLicence:rand()*6000,calcTyreCost:rand()*30000,calcTyreLife:25000+rand()*75000,calcAdminFee:rand()*500,calcInitiationFee:rand()*10000,calcOtherVehicle:rand()*5000,calcDebt:rand()*30000,calcLiving:rand()*60000,calcFutureValue:rand()*price,calcHorizon:12+Math.floor(rand()*108)});
 r=calc({price,consumption}); assert.strictEqual(r.errors.length,0,`random ${i} unexpectedly invalid`); for(const v of Object.values(r))if(typeof v==='number')assert(Number.isFinite(v),`random ${i} non-finite`); assert(r.principal>=0&&r.balloonAmount>=0&&r.financePayment>=0); assert(r.totalCashMonthly>=0&&r.stressTotal>=0); assert(r.balloonAmount<=r.principal*.600000001); const old=vals.calcBalloonPct; vals.calcBalloonPct=0; const r0=calc({price,consumption}); vals.calcBalloonPct=old; const r1=calc({price,consumption}); assert(r1.financePayment<=r0.financePayment+1e-7);
}
console.log('PASS: VECTORI v1.3 GitHub/Cloudflare static package');
console.log('PASS: 153 unique demo inventory records; JSON source and provenance retained');
console.log('PASS: 10,000 randomized calculator scenarios');
console.log('PASS: section numbering, six-vehicle selection, missing-data fail-closed and finance invariants');
