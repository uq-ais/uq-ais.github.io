// Renders data/members.json into #members.
const AVATAR = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="12"/><path d="M8 60c0-13 11-22 24-22s24 9 24 22z"/></svg>`;

function photo(p) {
  return p.photo
    ? `<img class="avatar" src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">`
    : `<div class="avatar avatar-empty" role="img" aria-label="${esc(p.name)}">${AVATAR}</div>`;
}

function nameLink(p) {
  return p.url ? `<a href="${esc(p.url)}">${esc(p.name)}</a>` : esc(p.name);
}

function memberCard(p) {
  return `<li class="person">
    ${photo(p)}
    <div class="person-name">${nameLink(p)}</div>
    <div class="person-role">${esc(p.role)} (${esc(p.start)}–${esc(p.end)})</div>
    ${p.topic ? `<div class="person-meta">${esc(p.topic)}</div>` : ""}
    ${p.previous ? `<div class="person-meta">${esc(p.previous)}</div>` : ""}
  </li>`;
}

function alumniCard(p) {
  return `<li class="person">
    ${photo(p)}
    <div class="person-name">${nameLink(p)}</div>
    ${p.destination ? `<div class="person-role">→ ${esc(p.destination)}</div>` : ""}
    <div class="person-meta">${esc(p.role)}@UQAIS, ${esc(p.start)}–${esc(p.end)}</div>
  </li>`;
}

function project(x) {
  const title = x.url ? `<a href="${esc(x.url)}">${esc(x.title)}</a>` : esc(x.title);
  return `<li><strong>${esc(x.people)}</strong> – <em>${title}</em>, ${esc(x.type)}, ${esc(x.period)}</li>`;
}

(async () => {
  const root = document.getElementById("members");
  try {
    const { groups = [], alumni = [], projects = [] } = await loadJSON("data/members.json");
    let html = groups.filter((g) => g.people?.length).map((g) =>
      `<h2>${esc(g.title)}</h2><ul class="people">${g.people.map(memberCard).join("")}</ul>`).join("");
    if (alumni.length) html += `<h2>Alumni</h2><ul class="people">${alumni.map(alumniCard).join("")}</ul>`;
    if (projects.length) html += `<h2>Visiting Students &amp; Student Projects</h2><ul class="projects">${projects.map(project).join("")}</ul>`;
    root.innerHTML = html;
  } catch (err) {
    showError(root, err);
  }
})();
