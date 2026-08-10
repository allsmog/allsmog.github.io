(() => {
  const style = document.createElement("style");
  style.textContent = (window.__OVLA_CSS || []).join("");
  document.head.appendChild(style);
  const source = (window.__OVLA_JS || []).join("");
  (0, eval)(source);
  delete window.__OVLA_CSS;
  delete window.__OVLA_JS;
})();
