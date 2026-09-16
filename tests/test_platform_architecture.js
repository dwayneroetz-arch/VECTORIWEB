const assert = require('assert');
const listings = require('../listing-utils.js');
const assets = require('../asset-engine.js');

const inventory = [
  {id:'a1',dealer:'Dealer A',price:100}, {id:'a2',dealer:'Dealer A',price:110}, {id:'a3',dealer:'Dealer A',price:120},
  {id:'b1',dealer:'Dealer B',price:200}, {id:'b2',dealer:'Dealer B',price:210},
  {id:'c1',dealer:'Dealer C',price:300}
];

const page = listings.diversifyByDealer(inventory, 6);
assert.strictEqual(page.length, 6);
assert.deepStrictEqual(page.slice(0,3).map(x=>x.dealer), ['Dealer A','Dealer B','Dealer C']);
const audit = listings.distributionAudit(page, 6);
assert.strictEqual(audit.distinctDealers, 3);
assert.ok(audit.maximumListingsFromOneDealer < 6);

const property = assets.normalize({assetType:'property',title:'House',price:1000000,agent:'Agent A'});
assert.strictEqual(property.assetType, 'property');
assert.strictEqual(property.askingPrice, 1000000);
assert.strictEqual(property.dealer, 'Agent A');

const jewellery = assets.normalize({assetType:'fine_jewellery',title:'Ring',price:50000,jeweller:'Jeweller A'});
assert.strictEqual(jewellery.assetType, 'fine_jewellery');
assert.strictEqual(jewellery.dealer, 'Jeweller A');

console.log('VECTORI platform architecture tests: PASS');
