# Whistle: Rules Made Easy

Plain-language sports rules for everyday viewers, with diagrams you can tap and a referee cat to explain every call.

The site lists 30 sports. Full rules pages so far: American football, soccer, basketball, baseball, volleyball, ice hockey, tennis, badminton, table tennis, boxing, judo, swimming, sprinting, alpine skiing, golf, curling, figure skating, gymnastics, and rugby. The rest appear on the home page as "Rules page in progress." Each page has a tap-to-explain diagram, at least one interactive simulator, tricky-rule flip cards, a glossary, and a 10-question quiz.

## Put it on GitHub Pages

1. Create a new repository on GitHub (for example `whistle`).
2. Upload everything in this folder to the repository root, keeping the folder structure.
3. Open **Settings > Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

No build step is needed. It is plain HTML, CSS, and JavaScript.

## Folder layout

```
index.html                 Page shell: header, app container, Buy Me a Coffee section
css/style.css              All styles (light and dark mode)
js/data.js                 Sport list and home page filters
js/common.js               Shared pieces: page header, tap-to-explain diagrams, timeline, flip cards, glossary, quiz
js/home.js                 Home page (filters and sport cards)
js/app.js                  Router (#/ for home, #/<sport-id> for a sport)
js/sports/<sport-id>.js    One file per sport page
assets/img/                Character images (referee cat, header avatar, one picture per sport)
```

## Add a new sport

1. Copy `js/sports/soccer.js` to `js/sports/<sport-id>.js`, using the same id as in `js/data.js` (for example `basketball`).
2. Replace the content: hero text and facts, diagrams, tricky rules, glossary, and the 10 quiz questions.
3. Change the last line to `SPORT_PAGES["<sport-id>"] = {render};`
4. Add `<script src="js/sports/<sport-id>.js"></script>` in `index.html`, next to the other sport files.

The home page card switches to "Read the rules" automatically.

## Quiz format

Each question in a sport file looks like this:

```js
{q:"Question text", o:["Option A","Option B","Option C","Option D"], a:2, why:"Explanation shown after answering"}
```

`a` is the position of the correct option, counting from 0. Add `visual: () => "<svg>...</svg>"` to show a picture with the question.

## Support

[Buy Me a Coffee](https://buymeacoffee.com/henryyu)
