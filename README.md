# Web for AIS

Static website for the AIS group, hosted on GitHub Pages.

- `index.html` — Home / About
- `members.html` — Members
- `research.html` — Research results
- `assets/style.css` — shared styles
- `assets/js/` — scripts that render the data files into the pages

## Editing content

Members and publications live in `data/`, not in the HTML:

- `data/members.json` — `groups` (current members by section), `alumni`, `projects`
- `data/publications.json` — `publications`; each paper's `tags` drive the filter chips on the Research page

Photos go in `assets/img/members/`, paper thumbnails in `assets/img/papers/`; reference them by path (e.g. `"photo": "assets/img/members/nguyen-van-a.jpg"`). Leave `photo`, `thumbnail`, `url` or any link empty to hide it.

Preview locally: `python3 -m http.server` then open http://localhost:8000
