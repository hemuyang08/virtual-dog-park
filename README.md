# Virtual Dog Park

A small, static website built for AIE1101 VIBE CODING — Week 5 Lab 2. It has two
parts: a **dog encyclopedia** describing three popular breeds, and **My Virtual Dog**,
where a visitor adopts a dog, feeds and plays with it, moves it forward one day at a
time, and watches it grow from Puppy to Adult Dog.

It is plain HTML, CSS and JavaScript — no frameworks, no build step, no server-side
code. The only files are `index.html`, `style.css`, `script.js` and the SVGs in `assets/`.

> **About the pictures:** all dog images in this project are **original SVG
> illustrations created for this project**. They are drawings, not photographs of
> real dogs.

## Features

- **Dog encyclopedia** — three breed cards (Beagle, Golden Retriever, Poodle), each
  with size, personality and everyday care.
- **Adopt a dog** — type a name (up to 20 characters, blank is rejected with a
  message) and choose a breed. The dog starts on Day 1, stage Puppy, happiness 50.
- **Feed** and **Play** — each adds 10 happiness, up to a maximum of 100.
- **Next Day** — moves the dog forward one day: day +1, happiness −5, never below 0.
- **Visible growth** — the stage is written in words (`Stage: Young Dog`), a growth
  bar fills from 25% to 100%, and the illustration gets bigger at each stage.
- **Saved progress** — name, breed, day and happiness are saved in the browser after
  adoption and after every Feed, Play and Next Day, and restored on refresh or reopen.
- **Start Over** — asks for confirmation, then deletes the saved dog and returns to
  the adoption form. If the confirmation is cancelled, the dog is kept unchanged.
- **Responsive layout** — three cards side by side on wide screens, one column on
  narrow screens.

## Previewing the site locally

Browsers restrict `localStorage` and may refuse to load the SVG images when a page is
opened as a `file://` link, so serve the folder over `http://` instead.

### VS Code Live Server (easiest)

1. Open the `virtual-dog-park` folder in VS Code (`File → Open Folder`).
2. Open the Extensions panel (`Ctrl+Shift+X`) and install **Live Server** by Ritwick Dey.
3. In the Explorer, right-click `index.html` and choose **Open with Live Server**.
4. The browser opens at an address like `http://127.0.0.1:5500/index.html`. Keep that
   window open while you edit — Live Server refreshes the page after each save.

If no browser opens automatically, right-click the editor tab and choose
**Open with Live Server** again, or copy the `127.0.0.1:5500` address shown in the
VS Code status bar.

### Any other local server

From a terminal in the project folder:

```
python -m http.server 8000
```

Then open <http://localhost:8000/>. Stop the server with `Ctrl+C`.

## Growth and happiness rules

**Growth** depends only on the day:

| Day | Stage shown in text | Growth bar | Illustration size |
| --- | --- | --- | --- |
| 1 | Puppy | 25% | 90 px |
| 2 | Young Dog | 50% | 130 px |
| 3 | Young Dog | 75% | 130 px |
| 4 and later | Adult Dog | 100% | 170 px |

The stage is always stated in words as well as shown by the bar and the picture size,
so it never depends on colour or size alone. A short sentence under the bar says what
happens next, e.g. `Young Dog stage — 1 more day until the Adult Dog stage.`

**Happiness**:

- Starts at **50** on adoption.
- **Feed** and **Play** each add **+10**, capped at **100**.
- **Next Day** subtracts **5**, and happiness is never allowed to fall below **0**
  (it can sit at 0, and the day still advances).
- Nothing else changes happiness; there is no happiness decay over real time.

## Where the pet's progress is stored

The dog is saved in the browser's **`localStorage`** — the small key/value store every
browser gives to each web page.

- Storage key: **`virtualDogParkPetV1`**
- Stored value is one JSON string:

  ```json
  {"name":"Biscuit","breed":"Beagle","day":2,"happiness":45}
  ```

- Saved immediately after adoption and after every Feed, Play and Next Day action;
  read back once when the page loads. Only one dog is stored — adopting again
  overwrites that single key.
- It is written by the page itself. Nothing is sent to a server, and nothing is
  written into the project files.

**It is not stored in a GitHub account.** GitHub is only where the code lives (and,
with GitHub Pages, where the site is served from). There is no login, no user account
and no database in this project, so the saved dog belongs to the browser it was
adopted in:

- Refreshing, closing the tab, or restarting the computer keeps the dog.
- Opening the same site in a **different browser**, on **a different computer**, or in
  a private/incognito window shows a fresh adoption form, not the old dog.
- Clearing the browser's site data, or clicking **Start Over**, deletes the dog for
  good. It cannot be recovered from GitHub or anywhere else.

To see the saved data: open the page, press `F12`, go to the **Application** tab
(Chrome/Edge) or **Storage** tab (Firefox), and look under **Local Storage** for this
page.

## Manual testing checklist

Run through this in the browser after starting the local server:

- [ ] The encyclopedia shows three breed cards, each with a visible illustration.
- [ ] Clicking **Adopt** with an empty name shows "Please enter a name for your dog."
      and stays on the form.
- [ ] Adopting "Biscuit" as a Beagle shows Day 1, Puppy, `Happiness: 50 / 100` and a
      growth bar at 25%.
- [ ] One **Next Day** gives Day 2, Young Dog, happiness 45, bar 50%, larger picture.
- [ ] A second **Next Day** gives Day 3, still Young Dog; a third gives Day 4,
      Adult Dog, bar 100%.
- [ ] **Feed** and **Play** each add 10, and stop at 100 rather than going over.
- [ ] Clicking **Next Day** until happiness reaches 0 leaves it at 0 while the day
      keeps increasing.
- [ ] **Refresh** the page: the same name, breed, day, happiness and stage come back.
- [ ] **Start Over → Cancel** keeps the dog exactly as it was.
- [ ] **Start Over → OK** returns to the adoption form, and refreshing afterwards
      still shows the form (nothing left in storage).
- [ ] In DevTools → Application → Local Storage, the key `virtualDogParkPetV1` holds
      exactly one entry with `name`, `breed`, `day`, `happiness`.
- [ ] Narrowing the window gives a single-column layout with no sideways scrolling.

## Files

```
index.html   page structure: header, encyclopedia, My Virtual Dog, footer
style.css    layout, colours, growth bar, button and form styles
script.js    adoption, care actions, growth rules, saving and restoring
assets/      beagle.svg, golden-retriever.svg, poodle.svg
             — original illustrations drawn for this project, not photographs
```
