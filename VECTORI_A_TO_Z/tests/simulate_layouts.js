const {pmt}=require('../purchase-engine');

// Engineering scenario simulation, not a human usability study.
// 20,000 synthetic journeys compare three information architectures.
const N=20000;
let seed=42;
function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
const layouts={
  single:{initialFields:18,decisionSteps:1,contextLoss:0.02,duplicateEntry:0.05,reviewDepth:0.70},
  wizard:{initialFields:6,decisionSteps:7,contextLoss:0.08,duplicateEntry:0.08,reviewDepth:0.90},
  hybrid:{initialFields:5,decisionSteps:5,contextLoss:0.03,duplicateEntry:0.03,reviewDepth:0.96}
};
const out={};
for(const [name,l] of Object.entries(layouts)){
  let useful=0, abandonment=0, errors=0, completed=0, weightedTime=0, evidenceVisible=0;
  for(let i=0;i<N;i++){
    const income=5000+rnd()*95000;
    const complexity=(rnd()*0.55)+(income<15000?0.25:0);
    const missing=rnd()*0.35;
    const initialBurden=l.initialFields/22;
    const abandonProb=clamp(0.03+initialBurden*0.22+complexity*0.10,0,0.45);
    const abandoned=rnd()<abandonProb;
    if(abandoned){abandonment++;continue;}
    completed++;
    useful++;
    const errorProb=clamp(0.015+l.duplicateEntry*0.18+missing*0.08+l.contextLoss*0.12,0,0.2);
    if(rnd()<errorProb) errors++;
    evidenceVisible+=l.reviewDepth*(1-missing*0.35);
    weightedTime += l.decisionSteps*2.0 + initialBurden*4 + complexity*2 + (1-l.reviewDepth)*3;
  }
  out[name]={completionRate:completed/N,errorRate:errors/Math.max(1,completed),evidenceCoverage:evidenceVisible/N,meanJourneyCost:weightedTime/Math.max(1,completed),usefulJourneys:useful};
}
console.log(JSON.stringify({N,seed,out},null,2));
