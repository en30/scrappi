chrome.storage.sync.get((items) => {
  Object.keys(items).forEach((key) => {
    const el = document.querySelector<HTMLInputElement>(`[name="${key}"]`);
    if (el) el.value = items[key];
  });
});

document.getElementById("cancel").addEventListener("click", () => {
  window.close();
});

document.getElementById("form").addEventListener("submit", () => {
  const options = Array.from(document.querySelectorAll("input")).reduce(
    (a, e) => ({ ...a, [e.name]: e.value }),
    {}
  );

  chrome.storage.sync.set(options, () => {
    window.close();
  });
});
