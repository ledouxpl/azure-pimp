import { parseAzureUrl, buildPimUrl } from './az-utils.js';

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const tabId = tab.id;
  const infoDiv = document.getElementById("resource-info");
  const button = document.getElementById("go-to-pim");

  // Try getting from storage first (in case it's already available)
  chrome.storage.local.get(`tab-${tabId}`, (result) => {
    let data = result[`tab-${tabId}`];

    // If not found in storage, fallback to parsing the current tab URL
    if (!data) {
      data = parseAzureUrl(tab.url);
    }

    if (data) {
      infoDiv.innerHTML = `
        <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
        <p><strong>Resource Group:</strong> ${data.resourceGroup}</p>
        <p><strong>Provider Type:</strong> ${data.providerPath}</p>
        <p><strong>Resource Name:</strong> ${data.resourceName}</p>
      `;
      button.style.display = "inline-block";
      button.onclick = () => {
        const pimUrl = buildPimUrl(data);
        chrome.tabs.create({ url: pimUrl });
      };
    } else {
      infoDiv.textContent = "No Azure resource detected.";
    }
  });
});