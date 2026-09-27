# UQ AIS website

Static website for the AIS group, hosted on GitHub Pages at **https://uq-ais.github.io**.

No build step: every push to `main` goes live in 1–2 minutes.

- [How the site is organised](#how-the-site-is-organised)
- [Quick start: editing content](#quick-start-editing-content)
- [Members](#members)
- [Student projects](#student-projects)
- [Publications and tags](#publications-and-tags)
- [Awards](#awards)
- [Filling in missing details](#filling-in-missing-details)
- [Images](#images)
- [JSON rules and troubleshooting](#json-rules-and-troubleshooting)
- [Preview locally](#preview-locally)

## How the site is organised

| File | What it is |
|---|---|
| `index.html` | Home page |
| `members.html` | Members page (content comes from `data/members.json`) |
| `research.html` | Research page (content comes from `data/publications.json`) |
| `data/members.json` | Current members, alumni, student projects |
| `data/publications.json` | Papers and their tags |
| `assets/img/members/` | Member photos |
| `assets/img/papers/` | Paper thumbnails |
| `assets/style.css` | Styles |
| `assets/js/` | Scripts that turn the data files into the pages; no need to touch these |

**To change content you only edit the files in `data/` and add images.** You never need to touch the HTML or JavaScript.

## Quick start: editing content

**On github.com (no setup):**

1. Open the repo, go to `data/members.json` or `data/publications.json`.
2. Click the pencil icon (Edit), make your change.
3. Click **Commit changes…**. The site updates in 1–2 minutes.

To upload a photo: go to `assets/img/members/`, click **Add file → Upload files**, drop the image, commit.

**On your computer:** edit the files, [preview locally](#preview-locally), then commit and push to `main`.

## Members

`data/members.json` has three lists: `groups`, `alumni` and `projects`.

### Current members (`groups`)

Each group is one section on the page, shown in the order they appear in the file. The section title is `title`, and `people` holds the cards:

```json
{
  "groups": [
    {
      "title": "PhD Students",
      "people": [
        {
          "name": "Jane Doe",
          "role": "PhD",
          "start": "2024.01",
          "end": "Present",
          "topic": "Open-world object detection",
          "previous": "MSc@UQ",
          "photo": "assets/img/members/jane-doe.jpg",
          "url": "https://janedoe.github.io"
        }
      ]
    }
  ]
}
```

| Field | Shown as | Required |
|---|---|---|
| `name` | Name under the photo. Also used to **bold** the person in paper author lists, so spell it exactly the same in both files. | Yes |
| `role` | `PhD (2024.01–Present)` | Yes |
| `start`, `end` | Dates in the line above. Use `"Present"` for current members. Leave `start` empty to show just the role. | No |
| `topic` | Research topic, in italics | No: leave `""` to hide |
| `previous` | Previous degree, e.g. `MSc@UQ` | No: leave `""` to hide |
| `photo` | Round photo. Empty shows a grey placeholder. | No |
| `url` | Makes the name a link (personal site, Google Scholar, LinkedIn…) | No |

- **Add a person:** copy an existing `{ … }` block inside `people`, paste it after the last one, add a comma between the two blocks, and edit the values.
- **Add a section** (e.g. "Research Assistants"): copy a whole `{ "title": …, "people": [ … ] }` block inside `groups`.
- **Reorder:** move blocks up or down; the page follows the file order.
- **Remove:** delete the block and fix the commas (see [JSON rules](#json-rules-and-troubleshooting)).
- An empty section (`"people": []`) is hidden automatically.

### Alumni (`alumni`)

When someone graduates, move their block from `groups` to `alumni`, set `end`, and replace `topic`/`previous` with `destination`:

```json
{
  "name": "Jane Doe",
  "role": "PhD",
  "start": "2021.07",
  "end": "2025.06",
  "destination": "Research Scientist @ Atlassian",
  "photo": "assets/img/members/jane-doe.jpg",
  "url": ""
}
```

This shows as **→ Research Scientist @ Atlassian** and *PhD@UQAIS, 2021.07–2025.06*.

## Student projects

Visiting students, winter research, capstone and placement projects are the `projects` list in `data/members.json`, shown as a bullet list at the bottom of the Members page:

```json
{
  "people": "Jane Doe, John Smith",
  "title": "Test-time adaptation for 3D detection",
  "type": "Winter Research",
  "period": "Jul '25 – Nov '25",
  "url": "https://youtube.com/…"
}
```

Shows as: **Jane Doe, John Smith** – *Test-time adaptation for 3D detection*, Winter Research, Jul '25 – Nov '25.
`people` is plain text, so list several names with commas. `url` (optional) turns the title into a link, e.g. a video, report or repo.

## Publications and tags

Papers live in `data/publications.json`. The Research page groups them by `year` (newest first) and builds the filter chips from the tags.

```json
{
  "publications": [
    {
      "title": "Test-Time Adaptation for 3D Object Detection",
      "authors": ["Jane Doe", "External Author", "John Smith"],
      "venue": "CVPR",
      "year": 2026,
      "tags": ["Computer Vision", "3D"],
      "thumbnail": "assets/img/papers/tta-3d.jpg",
      "links": {
        "pdf": "https://arxiv.org/abs/…",
        "code": "https://github.com/…",
        "project": ""
      },
      "bibtex": "@inproceedings{doe2026tta,\n  title={Test-Time Adaptation for 3D Object Detection},\n  author={Doe, Jane and Smith, John},\n  booktitle={CVPR},\n  year={2026}\n}"
    }
  ]
}
```

| Field | Notes |
|---|---|
| `title` | Paper title |
| `authors` | List of names in order. Names that match a member's `name` exactly are shown in **bold**. |
| `venue` | Short venue name, e.g. `CVPR`, `NeurIPS`, `arXiv` |
| `year` | A number **without quotes**: `2026`, not `"2026"` |
| `tags` | List of topic tags (see below) |
| `thumbnail` | Image on the left. Leave empty to show no image. |
| `links` | `pdf`, `code`, `project`: each becomes a button. Leave `""` to hide it. |
| `bibtex` | Optional. Adds a BibTeX button. Write line breaks as `\n` and escape any `"` as `\"`. |

The order of papers in the file doesn't matter; the page sorts them by year.

### Tags

- Tags are just text in each paper's `tags` list. **There's no separate tag list to maintain:** the filter chips are every tag used by at least one paper, sorted A–Z.
- **Add a tag:** put it on a paper, e.g. `"tags": ["Robotics", "World Models"]`. A new chip appears.
- **Rename a tag:** change it on every paper that uses it. Spelling and capitals must match exactly: `3D` and `3d` are two different chips.
- **Remove a tag:** delete it from every paper that uses it.
- Picking several chips shows papers that have **all** of the chosen tags. The search box matches titles, authors and venues.
- Filtered views can be shared as links, e.g. `https://uq-ais.github.io/research.html?tag=SLAM&tag=UWB`.

### Pages

The Research page shows **5 papers per page**, with page buttons at the bottom. Changing a filter or the search jumps back to page 1, and the page number is kept in the link (`research.html?page=2`). To show more per page, change `PAGE_SIZE` at the top of `assets/js/research.js`.

## Awards

There's no Awards section on the site yet. When you want one, ask for it to be added. It would work the same way as the rest: a `data/awards.json` file with a title, event, year and image for each award, and images in `assets/img/awards/`.

## Filling in missing details

All placeholder people have been replaced by the real lab members. What's still missing:

1. **Photos:** add them to `assets/img/members/` and set `photo` (see [Images](#images)). Until then each card shows a grey silhouette.
2. **Member details:** `start` dates, `topic` and `previous` for the students, and Lara's surname, in `data/members.json`.
3. **More sections:** add groups such as `Masters & Honours Students` or `Research Assistants` to `groups` when the lab has them.
4. **Alumni and projects:** add entries to `alumni` and `projects`; while they're empty (`[]`) those sections stay hidden.
5. **Papers:** `data/publications.json` holds the lab lead's publications. Add new papers to the list, plus thumbnails and BibTeX where you have them.
6. **Home page:** the introduction and research areas are in `index.html` inside `<main>`; the footer text is at the bottom of every `.html` file.

## Images

- **Member photos:** square crop, about **400×400 px**, JPG or WebP, under ~200 KB. Anything non-square is cropped to a circle from the centre.
- **Paper thumbnails:** about **640×400 px** (16:10), JPG, PNG or WebP.
- **File names:** lowercase with hyphens, no spaces, e.g. `jane-doe.jpg`. Names are case-sensitive on the live site: `Jane-Doe.JPG` ≠ `jane-doe.jpg`.
- The path in JSON is relative to the site root, with no leading slash: `"photo": "assets/img/members/jane-doe.jpg"`.
- An external image URL (`"https://…"`) also works.

## JSON rules and troubleshooting

If a page shows **"Could not load content"** or goes blank, the JSON file is almost certainly broken. The usual causes:

- **Commas:** put a comma between items, but **not after the last one**.
  ```json
  ["a", "b", "c"]     ✅
  ["a", "b", "c",]    ❌ trailing comma
  ["a" "b"]           ❌ missing comma
  ```
- **Quotes:** always use straight double quotes `"…"`. Single quotes and curly quotes (`“ ”`, often pasted from Word or Docs) break the file.
- **A `"` inside text** must be written as `\"`.
- **Brackets:** every `{` needs a `}` and every `[` needs a `]`.

Check a file before committing:

- Paste it into https://jsonlint.com, or
- run `python3 -m json.tool data/members.json > /dev/null && echo OK`.

Other issues:

| Problem | Fix |
|---|---|
| Photo not showing | Check the path and file name (including capitals and extension) match exactly. |
| Author not bold | The name in `authors` must match the member's `name` exactly. |
| Tag appears twice | Two spellings, e.g. `LLM` vs `LLMs`: make them identical. |
| Changes not live | Wait 1–2 minutes, then hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on a Mac). Check the repo's **Actions** tab to see whether the Pages deploy finished. |
| Page works online but not when opening the `.html` file directly | Browsers block loading data files from `file://`. Use the local preview below. |

## Preview locally

```bash
python3 -m http.server
```

Then open http://localhost:8000.
