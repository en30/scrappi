import { ScrapboxMessage } from "../messages";

const waitList = new Set<number>();
const u = (strings: TemplateStringsArray, ...exps: Array<string>) =>
  exps.reduce(
    (a, e, i) => a + encodeURIComponent(e) + strings[i + 1],
    strings[0]
  );
const scrapboxUrl = (project: string, title: string, body: string) =>
  u`https://scrapbox.io/${project}/${title}?body=${body}`;

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

  chrome.storage.sync.get(["project"], ({ project }) => {
    if (typeof project !== "string" || project.length === 0) {
      if (confirm("Please set Scrapbox Project")) {
        chrome.runtime.openOptionsPage();
      }
      return;
    }

    chrome.tabs.create(
      {
        url: scrapboxUrl(project, tab.title, body),
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
});
