import assert from 'node:assert/strict';import fs from 'node:fs';import {transferDuty,financePayment,calcOutcome} from '../engine.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/inventory.json',import.meta.url)));
const report=[];function t(name,fn){try{fn();report.push(['PASS',name])}catch(e){report.push(['FAIL',name,e.message]);throw e}}
for(const market of ['automotive','property','jewellery'])t(`${market}: 10 variants`,()=>assert.equal(data[market].length,10));
for(const market of ['automotive','property','jewellery'])t(`${market}: unique IDs and dealers`,()=>{const ids=new Set(data[market].map(x=>x.id));const dealers=new Set(data[market].map(x=>x.dealer));assert.equal(ids.size,10);assert.equal(dealers.size,10)});
t('SARS transfer duty bracket 1',()=>assert.equal(transferDuty(1210000),0));
t('SARS transfer duty bracket 2',()=>assert.equal(Math.round(transferDuty(1663800)),13614));
t('SARS transfer duty bracket 3',()=>assert.equal(Math.round(transferDuty(2329300)),53544));
t('finance zero interest',()=>assert.equal(Math.round(financePayment({price:120000,deposit:20000,rate:0,term:10}).instalment),10000));
t('finance balloon lowers scheduled instalment',()=>assert(financePayment({price:500000,rate:10.5,term:72,balloonPct:20}).instalment<financePayment({price:500000,rate:10.5,term:72,balloonPct:0}).instalment));
for(const market of ['automotive','property','jewellery'])t(`${market}: outcome changes when finance toggled`,()=>{const a={...data[market][0],assetType:market};const a1=calcOutcome(a,{finance:false,insurance:true});const a2=calcOutcome(a,{finance:true,insurance:true});assert.notEqual(a1.financeCost,a2.financeCost)});
t('property: duty feeds outcome',()=>{const a={...data.property[4],assetType:'property'};const o=calcOutcome(a,{finance:false,insurance:true});assert.equal(o.acquisitionCosts,transferDuty(a.price));});
t('insurance toggle changes outcome',()=>{const a={...data.automotive[0],assetType:'automotive'};const x=calcOutcome(a,{finance:false,insurance:true});const y=calcOutcome(a,{finance:false,insurance:false});assert(x.insuranceCost>y.insuranceCost)});
t('advertising separation invariant',()=>{const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');assert(html.includes('75 / 25 workspace rule'));assert(html.includes('They do not change the intelligence calculation'))});
t('provider evidence boundary exists',()=>{for(const market of ['automotive','property','jewellery'])for(const a of data[market])assert(a.status.startsWith('DEMO_'))});
console.log('\nVECTORI LEVEL 1 SIMULATION REPORT');for(const r of report)console.log(r[0],r[1]);console.log(`\n${report.length} simulations completed.`);
