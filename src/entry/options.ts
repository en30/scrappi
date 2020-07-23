import { defaultTemplate } from "../template";
import { keys } from "../options";

const defaults: Record<typeof keys[number], unknown> = {
  project: "",
  template: defaultTemplate,
};

const element = (key: typeof keys[number]) =>
  document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${key}"]`
  );

chrome.storage.sync.get(keys, (items) => {
  keys.forEach((key) => {
    const el = element(key);
    if (el) el.value = items[key] || defaults[key];
  });
});

document.getElementById("cancel").addEventListener("click", () => {
  window.close();
});

document.getElementById("form").addEventListener("submit", () => {
  const options = keys.reduce(
    (a, e) => ({
      ...a,
      [e]: element(e)?.value,
    }),
    {}
  );

  chrome.storage.sync.set(options, () => {
    window.close();
  });
});
