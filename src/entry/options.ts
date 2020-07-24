import { defaultTemplate } from "../template";
import { keys, Options, OptionKey, save, load } from "../options";

const defaults: Options = {
  project: "",
  template: defaultTemplate,
  timeFormat: "'['yyyy'-'LL']-'dd",
};

const element = (key: OptionKey) =>
  document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${key}"]`
  );

load().then((items) => {
  keys.forEach((key) => {
    const el = element(key);
    if (el) el.value = items[key] || defaults[key];
  });
});

document.getElementById("cancel").addEventListener("click", () => {
  window.close();
});

document.getElementById("form").addEventListener("submit", async () => {
  const options = keys.reduce(
    (a, e) => ({
      ...a,
      [e]: element(e)?.value,
    }),
    {}
  ) as Options;

  await save(options);
  window.close();
});
