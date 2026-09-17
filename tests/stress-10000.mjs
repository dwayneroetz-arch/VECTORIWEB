import assert from 'node:assert/strict';
import fs from 'node:fs';
import {transferDuty, propertyVAT, financeQuote, calcAssetOutcome, compareAssets, insuranceQuote} from '../engine.js';

const inv = JSON.parse(fs.readFileSync(new URL('../data/inventory.json', import.meta.url)));
const providers = JSON.parse(fs.readFileSync(new URL('../data/providers.json', import.meta.url)));
const verticals = ['automotive','property','jewellery'];
let seed = 0x51A7C0DE;
const rnd = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
const range = (a,b) => a + (b-a)*rnd();
const int = (a,b) => Math.floor(range(a,b+1));
const pick = a => a[int(0,a.length-1)];
const failures=[];
let checks=0;
function ok(c,msg,ctx={}) { checks++; if(!c && failures.length<40) failures.push({msg,ctx}); }
function near(a,b,t=0.02){return Math.abs(a-b)<=t*Math.max(1,Math.abs(a),Math.abs(b));}
function finiteDeep(x){return Object.values(x).every(v=>typeof v!=='number'||Number.isFinite(v));}

for(let i=1;i<=10000;i++){
  const market=verticals[(i-1)%3];
  const raw=pick(inv[market]);
  const asset={...raw,assetType:market};
  const price=asset.price;
  const finance=rnd()>0.18;
  const insurance=rnd()>0.22;
  const deposit=range(0,Math.min(price*0.45,500000));
  const rate=range(0,22);
  const term=pick([12,24,36,48,60,72,84]);
  const balloon=range(0,40);
  const monthlyFee=range(0,250);
  const initiationFee=range(0,2500);
  const horizon=int(12,120);
  const km=int(500,4500);
  const fuelPrice=range(20,40);
  const exitScenario=market==='jewellery'?pick(['future','fairMarket','trade','scrap']):'future';
  const income=range(0,150000), debt=range(0,70000), living=range(0,90000);
  const rentalOn=market==='property' && rnd()>0.25;
  const insuranceProduct=pick(providers.insurance.filter(x=>x.category===market));
  const iq=insuranceQuote(asset,insuranceProduct);
  const options={finance,insurance,deposit,rate,term,balloonPct:balloon,horizon,km,fuelPrice,monthlyFee,initiationFee,exitScenario,insuranceProduct,insuranceMonthly:iq.premiumMonthly};
  if(market==='property') asset.rentalMonthly=rentalOn?asset.rentalMonthly:0;
  const out=calcAssetOutcome(asset,options);

  ok(finiteDeep(out),`${market}: all top-level numeric outputs finite`,{i,asset:asset.id});
  ok(Number.isFinite(out.outcome),`${market}: outcome finite`,{i});
  ok(out.outcome===out.residual+out.income-out.economicCost,`${market}: outcome reconciliation`,{i});
  ok(out.acquisition>=0 && out.recurring>=0 && out.insurance>=0 && out.financeCharges>=0 && out.exitCosts>=0,`${market}: nonnegative cost buckets`,{i});
  if(finance){
    ok(out.financeQuote!==null,`${market}: finance quote exists`,{i});
    ok(out.financeQuote.principal>=0 && out.financeQuote.balloon>=0,`${market}: principal/balloon valid`,{i});
    const fq=out.financeQuote;
    const r=Math.max(0,Math.min(100,rate))/100/12;
    const pv=r===0 ? fq.basePayment*fq.term+fq.balloon : fq.basePayment*(1-Math.pow(1+r,-fq.term))/r+fq.balloon/Math.pow(1+r,fq.term);
    ok(near(pv,fq.principal,1e-9),`${market}: finance PV identity`,{i,rate,term,balloon});
  } else {
    ok(out.financeQuote===null && out.financeCharges===0,`${market}: finance off is inert`,{i});
  }
  if(insurance){
    ok(near(out.insurance,iq.premiumMonthly*horizon,1e-9),`${market}: selected insurance feeds outcome`,{i});
  } else ok(out.insurance===0,`${market}: insurance off is inert`,{i});
  if(market==='property'){
    const vat=propertyVAT(asset.price,{applicable:!!asset.vatApplicable,rate:asset.vatRate||15,priceIncludesVat:!!asset.priceIncludesVat});
    if(asset.vatApplicable){
      ok(out.detail.transferDuty===0,`property: VAT excludes transfer duty`,{i});
      ok(near(out.detail.vatAmount,vat.amount),`property: VAT amount matches`,{i});
    } else {
      ok(near(out.detail.transferDuty,transferDuty(asset.price)),`property: transfer duty matches SARS formula`,{i});
      ok(out.detail.vatAmount===0,`property: non-VAT has zero VAT`,{i});
    }
    ok(out.financeBase===vat.grossConsideration,`property: finance base equals gross consideration`,{i});
  }
  if(market==='automotive'){
    const expectedFuel=(Math.max(0,Number(asset.consumption)||0)/100)*km*fuelPrice*horizon;
    ok(near(out.detail.fuel,expectedFuel,1e-10),`automotive: fuel formula`,{i});
  }
  if(market==='jewellery'){
    const vals={future:asset.futureValue,fairMarket:asset.fairMarketValue,trade:asset.tradeValue,scrap:asset.scrapValue};
    ok(near(out.residual,Number(vals[exitScenario]??vals.future)),`jewellery: selected exit scenario`,{i,exitScenario});
  }
  const noIns=calcAssetOutcome(asset,{...options,insurance:false});
  if(iq.premiumMonthly>0) ok(near(noIns.outcome-out.outcome,out.insurance,1e-6),`${market}: insurance delta equals insurance cost`,{i});
  const noFin=calcAssetOutcome(asset,{...options,finance:false});
  ok(noFin.financeCharges===0,`${market}: no-finance charges zero`,{i});
  if(finance && out.financeCharges>0) ok(out.outcome<noFin.outcome,`${market}: finance charges reduce outcome`,{i});
  const higherFuel=market==='automotive'?calcAssetOutcome(asset,{...options,fuelPrice:fuelPrice+5}):null;
  if(higherFuel) ok(higherFuel.outcome<out.outcome,`automotive: higher fuel price lowers outcome`,{i});
  const higherExit=market==='jewellery'?calcAssetOutcome(asset,{...options,exitScenario:'fairMarket'}):null;
  if(higherExit && asset.fairMarketValue>=asset.scrapValue) ok(higherExit.outcome>=out.outcome || exitScenario==='future' || exitScenario==='fairMarket',`jewellery: exit scenario is directionally coherent`,{i});
  const cmp=compareAssets([asset],options)[0].outcome;
  ok(near(cmp.outcome,out.outcome,1e-12),`${market}: comparison uses central engine`,{i});
}

// Global catalogue / governance invariants
for(const m of verticals){
  ok(inv[m].length===10,`${m}: exactly 10 demo assets`);
  ok(new Set(inv[m].map(x=>x.providerId)).size===10,`${m}: 10 distinct asset providers`);
  ok(inv[m].every(x=>x.evidence && x.status?.startsWith('DEMO')),`${m}: demo/evidence labels present`);
}
ok(providers.finance.every(p=>p.evidence==='DEMO'), 'all finance providers explicitly demo');
ok(providers.insurance.every(p=>p.evidence==='DEMO'), 'all insurance providers explicitly demo');

if(failures.length){
  console.error(JSON.stringify({simulations:10000,checks,failed:failures.length,failures},null,2));
  process.exit(1);
}
console.log(JSON.stringify({suite:'VECTORI 1.2 stress simulation',simulations:10000,checks,failures:0,status:'PASS'},null,2));
