/* VECTORI A-to-Z Purchase Intelligence Engine
   Pure functions: no provider quote is fabricated. */

function num(v, fallback=0){
  const n=Number(v);
  return Number.isFinite(n)?n:fallback;
}
function pmt(rate,nper,pv,futureValue=0){
  if(nper<=0) return NaN;
  if(rate===0) return (pv-futureValue)/nper;
  const discount=Math.pow(1+rate,-nper);
  return (pv-futureValue*discount)*rate/(1-discount);
}
function amortization(principal, annualRate, term, balloon){
  const r=annualRate/12;
  const payment=pmt(r,term,principal,balloon);
  let balance=principal;
  const rows=[];
  for(let month=1;month<=term;month++){
    const interest=balance*r;
    const principalPaid=Math.min(Math.max(payment-interest,0),balance);
    balance=Math.max(0,balance-principalPaid);
    rows.push({month,payment,interest,principalPaid,balance});
  }
  return {payment,rows,finalBalance:balance};
}
function financeScenario(input, product={}){
  const price=num(input.price), deposit=num(input.deposit), tradeIn=num(input.tradeIn);
  const initiation=num(input.initiationFee), admin=num(input.adminFee), rate=num(input.rate)/100;
  const term=Math.max(1,Math.round(num(input.term,72)));
  const balloonPct=Math.max(0,num(input.balloonPct));
  const balloon=price*balloonPct/100;
  const principal=Math.max(0,price-deposit-tradeIn+initiation);
  const amort=amortization(principal,rate,term,balloon);
  const creditLifeRate=num(input.creditLifePerR1000,0);
  const creditLife=principal/1000*creditLifeRate;
  const totalInstalments=amort.payment*term;
  const totalAdmin=admin*term;
  const totalCost=deposit+tradeIn+totalInstalments+balloon+totalAdmin+creditLife;
  const totalInterest=Math.max(0,totalInstalments-balloon-principal);
  const stressRate=(num(input.rate)+num(input.stressRateAdd,1))/100;
  const stress=pmt(stressRate/12,term,principal,balloon);
  return {provider:product.provider||'',product:product.name||'',principal,balloon,balloonPct,rate:num(input.rate),term,payment:amort.payment,admin,initiation,creditLife,totalInstalments,totalInterest,totalAdmin,totalCost,stressPayment:stress,rows:amort.rows,evidence:product.evidence||'illustrative'};
}
function insuranceScenario(input, product={}){
  const premium=num(input.premium), excess=num(input.excess), voluntary=num(input.voluntaryExcess), additional=num(input.additionalExcess);
  const annual=premium*12;
  const totalExcess=Math.max(0,excess+voluntary+additional);
  const claimScenarios={
    minor:num(input.minorClaim,6000),
    major:num(input.majorClaim,30000),
    totalLoss:num(input.totalLossValue,Math.max(0,num(input.vehicleValue)))
  };
  const outOfPocket={};
  for(const [k,loss] of Object.entries(claimScenarios)) outOfPocket[k]=Math.min(loss,totalExcess);
  const shortfall=Math.max(0,num(input.financeSettlement)-num(input.insurerPayout));
  return {provider:product.provider||'',product:product.name||'',premium,annual,excess:totalExcess,claimOutOfPocket:outOfPocket,creditShortfall:shortfall,cover:product.cover||'quote-required',evidence:product.evidence||'illustrative'};
}
function totalOwnership(input, finance, insurance){
  const fuel=num(input.monthlyKm)*num(input.consumption)/100*num(input.fuelPrice);
  const maintenance=num(input.monthlyKm)*num(input.maintenancePerKm);
  const tyres=num(input.monthlyKm)/Math.max(1,num(input.tyreLife))*num(input.tyreSetCost);
  const licence=num(input.licenceAnnual)/12;
  const cash=finance.payment+finance.admin+finance.creditLife+fuel+maintenance+tyres+licence+insurance.premium+num(input.otherVehicleCosts);
  const principalComponent=Math.max(0,finance.payment-finance.rows[0].interest);
  const depreciation=num(input.futureValue)>0?Math.max(0,(num(input.price)-num(input.futureValue))/Math.max(1,num(input.horizon))):null;
  const economic=depreciation===null?null:cash-principalComponent+depreciation;
  const income=num(input.grossIncome);
  return {fuel,maintenance,tyres,licence,cash,economic,principalComponent,depreciation,vehicleBurdenPct:income>0?cash/income*100:null,cashRemaining:income>0?income-num(input.otherDebt)-num(input.livingCosts)-cash:null};
}
function stressTest(input, finance, insurance){
  const f=financeScenario({...input,rate:num(input.rate)+num(input.rateStress,1),fuelPrice:num(input.fuelPrice)*1.2,insurance:num(input.insurance)*1.15,maintenancePerKm:num(input.maintenancePerKm)*1.2});
  const i={...insurance,premium:insurance.premium*1.15};
  const t=totalOwnership({...input,fuelPrice:num(input.fuelPrice)*1.2,maintenancePerKm:num(input.maintenancePerKm)*1.2},f,i);
  return {finance:f,insurance:i,total:t};
}
function selectFinanceProducts(financeData,input){
  const out=[];
  for(const provider of financeData.providers||[]){
    for(const p of provider.products||[]){
      const term=Number(input.term);
      if(p.termMin && term<p.termMin) continue;
      if(p.termMax && term>p.termMax) continue;
      if(!p.balloonSupported && Number(input.balloonPct)>0 && !p.gfv) continue;
      if(p.balloonMaxPct!==null && Number(input.balloonPct)>p.balloonMaxPct) continue;
      out.push({...p,provider:provider.name,providerId:provider.id});
    }
  }
  return out;
}
function selectInsuranceProducts(insuranceData){
  return (insuranceData.providers||[]).flatMap(provider=>(provider.products||[]).map(p=>({...p,provider:provider.name,providerId:provider.id})));
}
function rankInsuranceQuotes(quotes, constraints={}){
  return [...quotes].sort((a,b)=>{
    const ca=(a.premium*12)+Math.min(a.excess,num(constraints.claimBudget,Infinity));
    const cb=(b.premium*12)+Math.min(b.excess,num(constraints.claimBudget,Infinity));
    return ca-cb;
  });
}
if(typeof module!=='undefined') module.exports={num,pmt,amortization,financeScenario,insuranceScenario,totalOwnership,stressTest,selectFinanceProducts,selectInsuranceProducts,rankInsuranceQuotes};
