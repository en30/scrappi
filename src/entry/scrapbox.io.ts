import { load } from "../messages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <F extends (...args: any) => void>(func: F, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

window.addEventListener("load", () => {
  const observer = new MutationObserver(
    debounce(() => {
      chrome.runtime.sendMessage(load());
    }, 600)
  );

  observer.observe(window.document, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
});
