import { defaultTemplate } from "./template";

export const keys = [
  "project",
  "template",
  "timeFormat",
  "ignorePatterns",
] as const;

export type OptionKey = typeof keys[number];
export type Options = {
  project: string;
  template: string;
  timeFormat: string;
  ignorePatterns: string;
};

export const defaultValues: Options = {
  project: "",
  template: defaultTemplate,
  timeFormat: "'['yyyy'-'LL']-'dd",
  ignorePatterns: `^chrome://
^http://localhost[:/]
`,
};

export const load = (): Promise<Options> =>
  new Promise((res) => chrome.storage.sync.get(keys, res));

export const save = (options: Options): Promise<void> =>
  new Promise((res) => {
    chrome.storage.sync.set(options, res);
  });
