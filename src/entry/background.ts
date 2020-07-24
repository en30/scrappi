import { DateTime } from "luxon";
import { ScrapboxMessage } from "../messages";
import { render } from "../template";
import { Options } from "../options";
import * as options from "../options";

const waitList = new Set<number>();
const u = (strings: TemplateStringsArray, ...exps: Array<string>) =>
  exps.reduce(
    (a, e, i) => a + encodeURIComponent(e) + strings[i + 1],
    strings[0]
  );
const scrapboxUrl = (project: string, title: string, body: string) =>
  u`https://scrapbox.io/${project}/${title}?body=${body}`;

const createScrapboxPage = (
  tab: chrome.tabs.Tab,
  { project, template, timeFormat }: Options
) => {
  const body = render(template, {
    title: tab.title,
    url: tab.url,
    addedAt: DateTime.local().toFormat(timeFormat),
  });

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
};

chrome.runtime.onMessage.addListener((message: ScrapboxMessage, sender) => {
  if (!sender.tab) return;

  if (message.type === "LOAD" && waitList.has(sender.tab.id)) {
    chrome.tabs.remove(sender.tab.id);
    waitList.delete(sender.tab.id);
  }
});

chrome.browserAction.onClicked.addListener(async () => {
  const opts = await options.load();
  if (typeof opts.project !== "string" || opts.project.length === 0) {
    if (confirm("Please set Scrapbox Project")) {
      chrome.runtime.openOptionsPage();
    }
    return;
  }

  const exps = opts.ignorePatterns
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((pattern) => new RegExp(pattern))
    .concat([
      new RegExp(`^https://scrapbox.io/${encodeURIComponent(opts.project)}/`),
    ]);
  const shouldIgnore = (url: string) => exps.some((exp) => exp.test(url));

  chrome.tabs.query({ pinned: false, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (shouldIgnore(tab.url)) return;

      createScrapboxPage(tab, opts);
    });
  });
});
