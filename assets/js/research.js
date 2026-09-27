// Renders data/publications.json into #pubs with tag + text filtering.
// Filter state lives in the URL (?tag=3D&tag=LLM&q=...&page=2) so filtered views can be shared.
const PAGE_SIZE = 5;
const LINK_LABELS = { pdf: "PDF", code: "Code", project: "Project" };

let pubs = [];
let memberNames = new Set();
const selected = new Set();
let query = "";
let page = 1;

function readURL() {
  const params = new URLSearchParams(location.search);
  params.getAll("tag").forEach((t) => selected.add(t));
  query = params.get("q") || "";
  page = Math.max(1, parseInt(params.get("page"), 10) || 1);
}

function writeURL() {
  const params = new URLSearchParams();
  selected.forEach((t) => params.append("tag", t));
  if (query) params.set("q", query);
  if (page > 1) params.set("page", page);
  const qs = params.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

function matches(p) {
  if (![...selected].every((t) => p.tags?.includes(t))) return false;
  if (!query) return true;
  const hay = `${p.title} ${(p.authors || []).join(" ")} ${p.venue}`.toLowerCase();
  return hay.includes(query.toLowerCase());
}

function authors(list = []) {
  return list.map((a) => memberNames.has(a) ? `<strong>${esc(a)}</strong>` : esc(a)).join(", ");
}

function pubItem(p, i) {
  const links = Object.entries(p.links || {})
    .filter(([, url]) => url)
    .map(([k, url]) => `<a class="btn" href="${esc(url)}">${esc(LINK_LABELS[k] || k)}</a>`);
  if (p.bibtex) links.push(`<button class="btn" type="button" data-bib="${i}">BibTeX</button>`);
  const thumb = p.thumbnail
    ? `<img class="thumb" src="${esc(p.thumbnail)}" alt="" loading="lazy">`
    : `<div class="thumb thumb-empty" aria-hidden="true"></div>`;
  return `<li class="pub">
    ${thumb}
    <div class="pub-body">
      <div class="pub-title">${esc(p.title)}</div>
      <div class="pub-authors">${authors(p.authors)}</div>
      <div class="pub-venue"><span class="venue">${esc(p.venue)} ${esc(p.year)}</span>
        ${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${links.length ? `<div class="pub-links">${links.join("")}</div>` : ""}
      ${p.bibtex ? `<pre class="bibtex" id="bib-${i}" hidden>${esc(p.bibtex)}</pre>` : ""}
    </div>
  </li>`;
}

function renderChips() {
  const tags = [...new Set(pubs.flatMap((p) => p.tags || []))].sort();
  document.getElementById("tags").innerHTML = tags.map((t) =>
    `<button type="button" class="chip" aria-pressed="${selected.has(t)}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
}

function renderPager(pages) {
  const pager = document.getElementById("pager");
  if (pages <= 1) { pager.innerHTML = ""; return; }
  const btn = (n, label, attrs = "") =>
    `<button type="button" class="page-btn" data-page="${n}" ${attrs}>${label}</button>`;
  let html = btn(page - 1, "‹ Prev", page === 1 ? "disabled" : "");
  for (let n = 1; n <= pages; n++) html += btn(n, n, n === page ? 'aria-current="page"' : "");
  html += btn(page + 1, "Next ›", page === pages ? "disabled" : "");
  pager.innerHTML = html;
}

function renderList() {
  const shown = pubs.map((p, i) => [p, i]).filter(([p]) => matches(p))
    .sort(([a], [b]) => b.year - a.year);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  page = Math.min(page, pages);
  const onPage = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const years = [...new Set(onPage.map(([p]) => p.year))];
  document.getElementById("pubs").innerHTML = onPage.length
    ? years.map((y) => `<h2>${esc(y)}</h2><ul class="pubs">${
        onPage.filter(([p]) => p.year === y).map(([p, i]) => pubItem(p, i)).join("")}</ul>`).join("")
    : `<p class="muted">No papers match these filters.</p>`;
  const from = shown.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = (page - 1) * PAGE_SIZE + onPage.length;
  document.getElementById("count").textContent =
    `Showing ${from}–${to} of ${shown.length} papers` + (shown.length < pubs.length ? ` (${pubs.length} total)` : "");
  document.getElementById("clear").hidden = !selected.size && !query;
  renderPager(pages);
}

function update() {
  writeURL();
  renderChips();
  renderList();
}

(async () => {
  const root = document.getElementById("pubs");
  try {
    const [data, members] = await Promise.all([
      loadJSON("data/publications.json"),
      loadJSON("data/members.json").catch(() => ({})),
    ]);
    pubs = data.publications || [];
    const people = [...(members.groups || []).flatMap((g) => g.people || []), ...(members.alumni || [])];
    memberNames = new Set(people.map((p) => p.name));
  } catch (err) {
    return showError(root, err);
  }

  readURL();
  const search = document.getElementById("search");
  search.value = query;

  document.getElementById("tags").addEventListener("click", (e) => {
    const tag = e.target.closest(".chip")?.dataset.tag;
    if (!tag) return;
    selected.has(tag) ? selected.delete(tag) : selected.add(tag);
    page = 1;
    update();
  });
  search.addEventListener("input", () => { query = search.value.trim(); page = 1; update(); });
  document.getElementById("clear").addEventListener("click", () => {
    selected.clear(); query = ""; search.value = ""; page = 1; update();
  });
  document.getElementById("pager").addEventListener("click", (e) => {
    const btn = e.target.closest(".page-btn");
    if (!btn || btn.disabled) return;
    page = Number(btn.dataset.page);
    update();
    document.querySelector(".filters").scrollIntoView({ behavior: "smooth" });
  });
  root.addEventListener("click", (e) => {
    const i = e.target.closest("[data-bib]")?.dataset.bib;
    if (i !== undefined) document.getElementById(`bib-${i}`).toggleAttribute("hidden");
  });

  update();
})();
