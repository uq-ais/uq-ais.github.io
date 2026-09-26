// Shared helpers for pages that render content from data/*.json.
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

function showError(el, err) {
  console.error(err);
  el.innerHTML = `<p class="muted">Could not load content. If you opened this file directly, run <code>python3 -m http.server</code> and use http://localhost:8000.</p>`;
}
