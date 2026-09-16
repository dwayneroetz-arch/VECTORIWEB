/* VECTORI Outcome Engine v2.0
   Deterministic scenario engine. No external data is invented.
   Inputs carry evidence status; missing inputs stay missing.
*/
(function(global){
  const n=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
  const finite=x=>Number.isFinite(Number(x));
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const sum=a=>a.filter(finite).reduce((s,x)=>s+Number(x),0);
  function pmt(rate,nper,pv,fv=0){
    if(!finite(rate)||!finite(nper)||nper<=0||!finite(pv)||pv<0) return NaN;
    fv=Math.max(0,n(fv));
    if(rate===0) return (pv-fv)/nper;
    const d=Math.pow(1+rate,-nper);
    return (pv-fv*d)*rate/(1-d);
  }
  function balanceAfterMonths(principal,annualRate,term,payment,months,fv=0){
    if(principal<=0) return 0;
    const m=annualRate/100/12;
    months=Math.max(0,Math.min(term,Math.floor(months)));
    if(m===0) return Math.max(0,principal-payment*months);
    return Math.max(0, principal*Math.pow(1+m,months)-payment*((Math.pow(1+m,months)-1)/m));
  }
  function amortization(principal,annualRate,term,payment,balloon){
    const rows=[]; let bal=principal; const m=annualRate/100/12;
    for(let month=1;month<=term;month++){
      const interest=bal*m; const principalPaid=Math.max(0,Math.min(bal,payment-interest));
      bal=Math.max(0,bal-principalPaid);
      rows.push({month,interest,principalPaid,balance:bal});
    }
    if(balloon>0) rows[rows.length-1].balance=balloon;
    return rows;
  }
  function financeScenario(input={}){
    const price=n(input.price), extras=n(input.extras), deposit=n(input.deposit), tradeIn=n(input.tradeIn), term=Math.max(1,n(input.term,72));
    const rate=n(input.rate), balloonPct=clamp(n(input.balloonPct),0,100), balloonAmount=n(input.balloonAmount, Math.max(0,(price+extras-Math.max(0,deposit)-Math.max(0,tradeIn))*balloonPct/100));
    const feesUpfront=n(input.initiationFee), monthlyFee=n(input.monthlyFee);
    const financed=Math.max(0,price+extras-Math.max(0,deposit)-Math.max(0,tradeIn));
    const payment=pmt(rate/100/12,term,financed,balloonAmount);
    const totalScheduled=payment*term+balloonAmount+monthlyFee*term+feesUpfront;
    const interestAndFees=Math.max(0,totalScheduled-financed);
    const horizon=Math.max(1,n(input.horizon,term));
    const monthsPaid=Math.min(horizon,term);
    const amort=amortization(financed,rate,term,payment,balloonAmount);
    const balance=monthsPaid>=term?balloonAmount:balanceAfterMonths(financed,rate,term,payment,monthsPaid,balloonAmount);
    const cashOutflow=deposit+feesUpfront+payment*monthsPaid+monthlyFee*monthsPaid+(monthsPaid>=term?balloonAmount:0);
    return {type:'instalment_sale',financed,monthlyPayment:payment,balloonAmount,term,rate,monthlyFee,initiationFee:feesUpfront,totalScheduled,interestAndFees,balanceAtHorizon:balance,cashOutflowHorizon:cashOutflow,amortization:amort};
  }
  function leaseScenario(input={}){
    const monthly=n(input.monthlyPayment), deposit=n(input.deposit), fees=n(input.upfrontFees), term=Math.max(1,n(input.term,36));
    const exitValue=n(input.exitPurchasePrice), exitCost=n(input.exitFees), horizon=Math.max(1,n(input.horizon,term));
    const months=Math.min(term,horizon); const cash=deposit+fees+monthly*months+(months>=term?exitCost:0);
    return {type:'lease_or_rental',monthlyPayment:monthly,term,deposit,upfrontFees:fees,exitPurchasePrice:exitValue,exitFees:exitCost,cashOutflowHorizon:cash,balanceAtHorizon:months>=term?0:Math.max(0,exitValue)};
  }
  function gfvScenario(input={}){
    const base=financeScenario({...input,balloonAmount:n(input.gfvAmount),balloonPct:0});
    const gfv=finite(input.gfvAmount)?n(input.gfvAmount):Math.max(0,(n(input.price)-n(input.deposit)-n(input.tradeIn))*n(input.balloonPct)/100); const options={
      replace:{description:'Trade/replace subject to contract conditions and provider approval.',cashAtEnd:0,assetValue:gfv},
      return:{description:'Return subject to mileage, condition and agreement conditions.',cashAtEnd:n(input.returnCharges),assetValue:0},
      retain:{description:'Settle or refinance the GFV subject to a new agreement and approval.',cashAtEnd:gfv,assetValue:gfv}
    };
    return {...base,type:'gfv',gfvAmount:gfv,endOptions:options};
  }
  function automotiveScenario(input={}){
    const km=n(input.monthlyKm), fuel=n(input.fuelPrice), consumption=n(input.consumption), horizon=Math.max(1,n(input.horizon,60));
    const fuelMonthly=consumption>0?consumption*km/100*fuel:NaN;
    const maintenanceMonthly=n(input.maintenancePerKm)*km;
    const tyresMonthly=n(input.tyreCost)>0&&n(input.tyreLife)>0?km/n(input.tyreLife)*n(input.tyreCost):0;
    const licenceMonthly=n(input.licenceAnnual)/12;
    const serviceMonthly=n(input.servicePlanMonthly);
    const warrantyMonthly=n(input.warrantyMonthly);
    const tolls=n(input.tollsMonthly), parking=n(input.parkingMonthly), other=n(input.otherVehicleMonthly);
    const operating=sum([fuelMonthly,maintenanceMonthly,tyresMonthly,licenceMonthly,serviceMonthly,warrantyMonthly,tolls,parking,other]);
    const futureValue=finite(input.futureValue)?n(input.futureValue):null;
    const depreciation=futureValue!==null?Math.max(0,(n(input.price)-n(input.tradeIn))-futureValue)/horizon:NaN;
    return {fuelMonthly,maintenanceMonthly,tyresMonthly,licenceMonthly,serviceMonthly,warrantyMonthly,tollsMonthly:tolls,parkingMonthly:parking,otherMonthly:other,operatingMonthly:operating,depreciationMonthly:depreciation,futureValue,horizon};
  }
  function insuranceScenario(input={}){
    const premium=n(input.premiumMonthly), excess=n(input.excess), shortfall=n(input.shortfallCoverMonthly), creditProtection=n(input.creditProtectionMonthly), warranty=n(input.warrantyMonthly), other=n(input.otherMonthly), claimsReserve=n(input.expectedClaimsReserveMonthly), horizon=Math.max(1,n(input.horizon,60));
    return {premiumMonthly:premium,excess,shortfallMonthly:shortfall,creditProtectionMonthly:creditProtection,warrantyMonthly:warranty,otherMonthly:other,claimsReserveMonthly:claimsReserve,monthly:sum([premium,shortfall,creditProtection,warranty,other,claimsReserve]),contingentExposure:excess,horizon};
  }
  function customerOutcome(input={}){
    const horizon=Math.max(1,n(input.horizon,60));
    const modules=input.modules||{automotive:true,insurance:true,finance:true};
    const auto=modules.automotive?automotiveScenario({...input,horizon}):null;
    let fin=null;
    if(modules.finance){
      if(input.financeType==='lease_or_rental') fin=leaseScenario({...input,horizon});
      else if(input.financeType==='gfv') fin=gfvScenario({...input,horizon});
      else fin=financeScenario({...input,horizon});
    }
    const ins=modules.insurance?insuranceScenario({...input,horizon}):null;
    const cashPurchase=(!modules.finance && modules.automotive)?Math.max(0,n(input.price)+n(input.extras)-n(input.tradeIn)):0;
    const upfront=sum([cashPurchase, n(input.otherUpfront)]);
    const financeCash=fin?.cashOutflowHorizon||0;
    const operating=auto?.operatingMonthly*horizon||0;
    const insuranceCash=ins?.monthly*horizon||0;
    const cashOutflow=financeCash+operating+insuranceCash+upfront;
    const assetValue=auto?.futureValue!==null && auto?.futureValue!==undefined ? auto.futureValue : null;
    const balance=fin?.balanceAtHorizon||0;
    const contingentInsuranceExposure=ins?.contingentExposure||0;
    const netEquity=assetValue!==null?assetValue-balance:null;
    const economicCost=netEquity!==null?cashOutflow-netEquity:null;
    const monthlyCash=horizon>0?cashOutflow/horizon:NaN;
    const income=n(input.netIncome||input.income);
    const existingDebt=n(input.existingDebt||input.debt);
    const living=n(input.livingCosts||input.living);
    const cashRemaining=finite(income)?income-existingDebt-living-(auto?.operatingMonthly||0)-(ins?.monthly||0)-(fin?.monthlyPayment||0)-(fin?.monthlyFee||0):NaN;
    const affordabilityRatio=finite(income)&&income>0?((auto?.operatingMonthly||0)+(ins?.monthly||0)+(fin?.monthlyPayment||0)+(fin?.monthlyFee||0))/income*100:NaN;
    const evidence=[];
    const required=[['vehicle price',input.price],['monthly kilometres',input.monthlyKm]];
    if(modules.finance) required.push(['finance rate',input.rate],['finance term',input.term]);
    if(modules.insurance) required.push(['insurance premium',input.premiumMonthly]);
    required.forEach(([label,value])=>{if(!finite(value)||Number(value)<0)evidence.push({label,status:'MISSING'});});
    if(assetValue===null)evidence.push({label:'future/exit asset value',status:'MISSING'});
    const completeness=Math.round(((required.length-evidence.length)/Math.max(1,required.length))*100);
    return {horizon,modules,automotive:auto,finance:fin,insurance:ins,monthlyCashOutflow:monthlyCash,cashOutflowHorizon:cashOutflow,assetValue,financeBalanceAtHorizon:balance,netEquity,economicCost,economicMonthlyCost:finite(economicCost)?economicCost/horizon:NaN,contingentInsuranceExposure,cashRemaining,affordabilityRatio,evidence, evidenceCompleteness:completeness};
  }
  function scenarioRange(input, changes=[]){ return changes.map(change=>({name:change.name,result:customerOutcome({...input,...change.patch})})); }
  function validateResult(r){
    const errors=[];
    if(!r||!finite(r.cashOutflowHorizon)||r.cashOutflowHorizon<0) errors.push('Cash outflow must be finite and non-negative.');
    if(r.finance && (!finite(r.finance.monthlyPayment)||r.finance.monthlyPayment<0)) errors.push('Finance payment is invalid.');
    if(r.economicCost!==null && r.economicCost<0 && finite(r.cashOutflowHorizon)) errors.push('Economic cost unexpectedly negative; verify asset value and horizon inputs.');
    return {ok:errors.length===0,errors};
  }
  global.VECTORIOutcomeEngine={pmt,financeScenario,leaseScenario,gfvScenario,automotiveScenario,insuranceScenario,customerOutcome,scenarioRange,validateResult,version:'2.0.0'};
})(typeof window !== 'undefined' ? window : globalThis);
if(typeof module!=='undefined') module.exports=globalThis.VECTORIOutcomeEngine;
