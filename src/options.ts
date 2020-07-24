export const keys = ["project", "template", "timeFormat"] as const;

export type OptionKey = typeof keys[number];
export type Options = {
  project: string;
  template: string;
  timeFormat: string;
};

export const load = (): Promise<Options> =>
  new Promise((res) => chrome.storage.sync.get(keys, res));

export const save = (options: Options): Promise<void> =>
  new Promise((res) => {
    chrome.storage.sync.set(options, res);
  });
