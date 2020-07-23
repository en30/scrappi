import { ScrapboxMessage } from "../messages";

const waitList = new Set<number>();

chrome.runtime.onMessage.addListener((message: ScrapboxMessage, sender) => {
  if (!sender.tab) return;

  if (message.type === "LOAD" && waitList.has(sender.tab.id)) {
    chrome.tabs.remove(sender.tab.id);
    waitList.delete(sender.tab.id);
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  const addedOn = new Date().toISOString().replace(/T.*$/, "");
  const body = `[${tab.title} ${tab.url}]

Added on [${addedOn}]
#Scrappi!`;

  chrome.tabs.create(
    {
      url: `https://scrapbox.io/en30/${encodeURIComponent(
        tab.title
      )}?body=${encodeURIComponent(body)}`,
    },
    (newTab) => {
      chrome.tabs.remove(tab.id);

      // cannot send message to the newTab here
      // because it's listener is not ready yet.
      waitList.add(newTab.id);

      setTimeout(() => waitList.delete(newTab.id), 10000);
    }
  );
});
