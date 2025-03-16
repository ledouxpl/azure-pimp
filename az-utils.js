// az-utils.js

export function parseAzureUrl(url) {
    const regex = /\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)\/providers\/([^/]+\/[^/]+)\/([^/?#]+)/;
    const match = url.match(regex);
    if (!match) return null;
  
    return {
      subscriptionId: match[1],
      resourceGroup: match[2],
      providerPath: match[3],
      resourceName: match[4],
      fullUrl: url
    };
  }
  
  export function buildPimUrl(data) {
    const base = "https://portal.azure.com/#view/Microsoft_Azure_PIMCommon/ResourceMenuBlade/~/MyActions/provider/azurerbac";
    const extId = encodeURIComponent(`/subscriptions/${data.subscriptionId}/resourceGroups/${data.resourceGroup}/providers/${data.providerPath}/${data.resourceName}`);
    return `${base}/resourceDisplayName/${data.resourceName}/resourceExternalId/${extId}/tenantName//resourceType/${encodeURIComponent(data.providerPath)}`;
  }