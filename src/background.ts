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
    () => chrome.tabs.remove(tab.id)
  );
});
