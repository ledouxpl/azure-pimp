import { parseAzureUrl, buildPimUrl } from "./az-utils.js";

function setExtensionUI(tabId, { popup = "", badge = "", currentResource = null } = {}) {
  chrome.action.setPopup({ tabId, popup });
  chrome.action.setBadgeText({ text: badge, tabId });

  chrome.contextMenus.removeAll(() => {
    const menuItems = [];

    // Add current resource (if available)
    if (currentResource) {
      menuItems.push({
        id: `browse-to-pim-${tabId}`,
        title: `Browse to PIM for ${currentResource.resourceName}`,
      });
      menuItems.push({
        id: `separator-${tabId}`,
        type: "separator",
      });
    }

    // Add history section
    chrome.storage.local.get("pim-history", (res) => {
      const history = res["pim-history"] || [];

      history.forEach((item, idx) => {
        menuItems.push({
          id: `history-pim-${idx}`,
          title: `🕘 ${item.title}`,
        });
      });

      // Build context menu
      menuItems.forEach((item) => {
        if (item.type === "separator") {
          chrome.contextMenus.create({
            id: item.id,
            type: "separator",
            contexts: ["action"],
          });
        } else {
          chrome.contextMenus.create({
            id: item.id,
            title: item.title,
            contexts: ["action"],
          });
        }
      });
    });
  });
}

function addToHistory(resourceName, pimUrl) {
  chrome.storage.local.get("pim-history", (result) => {
    let history = result["pim-history"] || [];

    history = history.filter((entry) => entry.url !== pimUrl);
    history.unshift({ title: resourceName, url: pimUrl });
    history = history.slice(0, 5);

    chrome.storage.local.set({ "pim-history": history });
  });
}

function updateTabStatus(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url) return;

    const restricted = /^chrome:|^chrome-extension:/;
    if (restricted.test(tab.url)) {
      console.warn("🚫 Skipping tab — restricted URL:", tab.url);
      setExtensionUI(tabId, {}); // clear UI, show only history
      return;
    }

    console.log("📩 background.js evaluating tab URL:", tab.url);
    const data = parseAzureUrl(tab.url);

    if (data) {
      chrome.storage.local.set({ [`tab-${tabId}`]: data });

      const pimUrl = buildPimUrl(data);
      chrome.storage.local.set({ [`pim-url-${tabId}`]: pimUrl });

      setExtensionUI(tabId, {
        popup: "popup.html",
        badge: "✔",
        currentResource: data,
      });
    } else {
      chrome.storage.local.remove([`tab-${tabId}`, `pim-url-${tabId}`]);
      setExtensionUI(tabId, {}); // no resource, show only history
    }
  });
}

// Tab change and navigation detection
chrome.tabs.onActivated.addListener(({ tabId }) => {
  console.log("📩 Tab activated:", tabId);
  updateTabStatus(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    console.log("📩 Tab updated (complete):", tabId);
    updateTabStatus(tabId);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("browse-to-pim-")) {
    const tabId = parseInt(info.menuItemId.replace("browse-to-pim-", ""), 10);

    chrome.storage.local.get([`pim-url-${tabId}`, `tab-${tabId}`], (res) => {
      const pimUrl = res[`pim-url-${tabId}`];
      const data = res[`tab-${tabId}`];
      if (pimUrl) {
        addToHistory(data?.resourceName || "Unknown Resource", pimUrl);
        chrome.tabs.create({ url: pimUrl });
      }
    });
  } else if (info.menuItemId.startsWith("history-pim-")) {
    const index = parseInt(info.menuItemId.replace("history-pim-", ""), 10);

    chrome.storage.local.get("pim-history", (res) => {
      const item = res["pim-history"]?.[index];
      if (item?.url) {
        addToHistory(item.title, item.url); // re-promote to top
        chrome.tabs.create({ url: item.url });
      }
    });
  }
});
