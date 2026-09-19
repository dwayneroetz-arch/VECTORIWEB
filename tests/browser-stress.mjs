import { chromium } from 'playwright';

const BASE_URL = process.argv[2];
const N = Number(process.argv[3] || 10000);
if (!BASE_URL) { console.error('Usage: node tests/browser-stress.mjs <URL> [iterations]'); process.exit(2); }

let seed=0xB16B00B5;
const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)];
const errors=[]; let passed=0, failed=0;
const markets=['automotive','property','jewellery'];

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error') errors.push(`console: ${m.text()}`)});

for(let i=1;i<=N;i++){
  try{
    await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
    await page.locator('.market-tab').nth(Math.floor(rnd()*3)).click();
    await page.waitForTimeout(5);
    const cards=page.locator('.asset-card');
    if(await cards.count()!==10) throw new Error('expected 10 asset cards');
    if(rnd()<0.5){
      await page.locator('#search').fill(pick(['','Demo','AUTO','PROPERTY','JEWELLERY']));
      await page.locator('#clearFilters').click();
    }
    if(rnd()<0.5){
      await page.locator('#sort').selectOption(pick(['signal','price','burden']));
    }
    const currentCards=page.locator('.asset-card');
    const idx=Math.floor(rnd()*Math.max(1,await currentCards.count()));
    await currentCards.nth(Math.min(idx,Math.max(0,(await currentCards.count())-1))).locator('.intel-btn').click();
    if(await page.locator('#intelligence .outcome-card').count()!==1) throw new Error('intelligence did not open');
    if(rnd()<0.5){await page.locator('#financeToggle').uncheck(); await page.locator('#recalc').click(); await page.locator('#financeToggle').check();}
    if(rnd()<0.5){await page.locator('#insuranceToggle').uncheck(); await page.locator('#recalc').click(); await page.locator('#insuranceToggle').check();}
    if(rnd()<0.5){await page.locator('#deposit').fill(String(Math.floor(rnd()*100000)));}
    if(rnd()<0.5){await page.locator('#rate').fill((rnd()*20).toFixed(2));}
    if(rnd()<0.5){await page.locator('#term').fill(String(pick([12,24,36,48,60,72])));}
    if(rnd()<0.5){await page.locator('#balloon').fill((rnd()*30).toFixed(1));}
    if(rnd()<0.5){await page.locator('#recalc').click();}
    if(rnd()<0.4){
      const cmp=page.locator('.compare-btn'); const c=Math.min(3,await cmp.count());
      for(let j=0;j<c;j++) await cmp.nth(j).click();
      if(Number(await page.locator('#compareCount').innerText())>3) throw new Error('compare cap broken');
    }
    await page.locator('#closeIntel').click();
    if(await page.locator('#intelligence .outcome-card').count()!==0) throw new Error('close intelligence failed');
    passed++;
  } catch(e){
    failed++;
    if(errors.length<20) errors.push(`iteration ${i}: ${e.message}`);
  }
}
await browser.close();
console.log(JSON.stringify({suite:'VECTORI browser workflow stress',url:BASE_URL,iterations:N,passed,failed,browserErrors:errors.slice(0,20),status:failed?'FAIL':'PASS'},null,2));
process.exit(failed?1:0);
