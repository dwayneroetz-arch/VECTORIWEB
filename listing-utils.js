/* VECTORI listing distribution utilities v1.0
   Purpose: preserve fair dealer representation in a result page without
   inventing inventory or changing explicit user filters.
*/
(function(global){
  function dealerKey(item){
    const value = item && (item.dealer || item.dealership || item.agent || item.agency || item.jeweller || item.seller);
    return String(value || 'Unknown dealer').trim() || 'Unknown dealer';
  }

  function groupByDealer(items){
    const groups = new Map();
    (items || []).forEach(item => {
      const key = dealerKey(item);
      if(!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return groups;
  }

  // Interleave dealer groups while preserving each dealer's internal sort order.
  // This is a presentation rule, not a ranking or dealer recommendation.
  function diversifyByDealer(items, limit, options={}){
    const list = Array.isArray(items) ? items.slice() : [];
    const max = Number.isFinite(Number(limit)) ? Math.max(0, Number(limit)) : list.length;
    if(list.length <= 1 || options.disable) return list.slice(0, max);

    const groups = [...groupByDealer(list).entries()];
    if(groups.length <= 1) return list.slice(0, max);

    const result = [];
    let index = 0;
    while(result.length < Math.min(max, list.length)){
      let added = false;
      for(const [, group] of groups){
        if(index < group.length && result.length < max){
          result.push(group[index]);
          added = true;
        }
      }
      if(!added) break;
      index += 1;
    }
    return result;
  }

  function dealerMix(items){
    const counts = {};
    (items || []).forEach(item => {
      const key = dealerKey(item);
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([dealer,count]) => ({dealer,count}));
  }

  function distributionAudit(items, target=6){
    const mix = dealerMix(items);
    const distinct = mix.length;
    const max = mix.length ? Math.max(...mix.map(x => x.count)) : 0;
    return {
      distinctDealers: distinct,
      maximumListingsFromOneDealer: max,
      targetListings: target,
      diversified: distinct > 1 ? max < Math.min(target, items.length) : true,
      mix
    };
  }

  global.VECTORIListingUtils = {dealerKey, groupByDealer, diversifyByDealer, dealerMix, distributionAudit};
})(typeof window !== 'undefined' ? window : globalThis);

if(typeof module !== 'undefined') module.exports = globalThis.VECTORIListingUtils;
