/* VECTORI Asset Intelligence adapters v1.0
   Common asset contract for Automotive, Property and Fine Jewellery.
   Adapters normalize asset-specific fields without pretending that the
   economics or evidence requirements are identical across verticals.
*/
(function(global){
  const n = (x, d=null) => Number.isFinite(Number(x)) ? Number(x) : d;
  const text = (x, d='') => x == null ? d : String(x).trim();

  const adapters = {
    automotive(asset={}){
      return {
        assetType:'automotive',
        title:text(asset.title || [asset.year,asset.make,asset.model,asset.variant].filter(Boolean).join(' ')),
        askingPrice:n(asset.price),
        marketReference:n(asset.market),
        futureValue:n(asset.futureValue),
        location:text(asset.province || asset.location),
        dealer:text(asset.dealer || asset.dealership),
        identifiers:{vin:text(asset.vin), listingId:text(asset.listingId || asset.id)},
        evidence:text(asset.evidence || 'Missing')
      };
    },
    property(asset={}){
      return {
        assetType:'property',
        title:text(asset.title || [asset.propertyType,asset.suburb,asset.city].filter(Boolean).join(' • ')),
        askingPrice:n(asset.price),
        marketReference:n(asset.market),
        futureValue:n(asset.futureValue),
        location:text(asset.suburb || asset.city || asset.province || asset.location),
        dealer:text(asset.agent || asset.agency || asset.dealer),
        identifiers:{listingId:text(asset.listingId || asset.id)},
        evidence:text(asset.evidence || 'Missing')
      };
    },
    jewellery(asset={}){
      return {
        assetType:'fine_jewellery',
        title:text(asset.title || [asset.brand,asset.itemType,asset.reference].filter(Boolean).join(' • ')),
        askingPrice:n(asset.price),
        marketReference:n(asset.market),
        futureValue:n(asset.futureValue),
        location:text(asset.location),
        dealer:text(asset.jeweller || asset.dealer || asset.seller),
        identifiers:{listingId:text(asset.listingId || asset.id), certification:text(asset.certification)},
        evidence:text(asset.evidence || 'Missing')
      };
    }
  };

  function normalize(asset={}){
    const type = text(asset.assetType || asset.vertical || 'automotive').toLowerCase();
    if(type === 'property' || type === 'real_estate') return adapters.property(asset);
    if(type === 'jewellery' || type === 'fine_jewellery' || type === 'fine-jewellery') return adapters.jewellery(asset);
    return adapters.automotive(asset);
  }

  global.VECTORIAssetEngine = {adapters, normalize, version:'1.0.0'};
})(typeof window !== 'undefined' ? window : globalThis);

if(typeof module !== 'undefined') module.exports = globalThis.VECTORIAssetEngine;
