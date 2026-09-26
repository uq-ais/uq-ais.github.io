// Renders data/publications.json into #pubs with tag + text filtering.
// Filter state lives in the URL (?tag=3D&tag=LLM&q=...) so filtered views can be shared.
const LINK_LABELS = { pdf: "PDF", code: "Code", project: "Project" };

let pubs = [];
let memberNames = new Set();
const selected = new Set();
let query = "";

function readURL() {
  const params = new URLSearchParams(location.search);
  params.getAll("tag").forEach((t) => selected.add(t));
  query = params.get("q") || "";
}

function writeURL() {
  const params = new URLSearchParams();
  selected.forEach((t) => params.append("tag", t));
  if (query) params.set("q", query);
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

function renderList() {
  const shown = pubs.map((p, i) => [p, i]).filter(([p]) => matches(p))
    .sort(([a], [b]) => b.year - a.year);
  const years = [...new Set(shown.map(([p]) => p.year))];
  document.getElementById("pubs").innerHTML = shown.length
    ? years.map((y) => `<h2>${esc(y)}</h2><ul class="pubs">${
        shown.filter(([p]) => p.year === y).map(([p, i]) => pubItem(p, i)).join("")}</ul>`).join("")
    : `<p class="muted">No papers match these filters.</p>`;
  document.getElementById("count").textContent = `${shown.length} of ${pubs.length} papers`;
  document.getElementById("clear").hidden = !selected.size && !query;
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
    update();
  });
  search.addEventListener("input", () => { query = search.value.trim(); update(); });
  document.getElementById("clear").addEventListener("click", () => {
    selected.clear(); query = ""; search.value = ""; update();
  });
  root.addEventListener("click", (e) => {
    const i = e.target.closest("[data-bib]")?.dataset.bib;
    if (i !== undefined) document.getElementById(`bib-${i}`).toggleAttribute("hidden");
  });

  update();
})();
