# How to build and upload the Makebot site

## The idea in one minute
Your pages used to load the header, footer and cart drawer *in the visitor's browser*, every time.
Now a small script does that once, on your computer, and saves the finished site in a folder called **dist**.
**You upload the contents of `dist`, not the project folder.**

## One-time setup (5 minutes)
1. Back up / commit your project first.
2. Copy these files into the project root (the same folder as `index.html`):
   `build.js`, `package.json`, `.gitignore`, `HOW-TO-USE.md`, and `Components.js` (replaces the old one).
3. Open a terminal in that folder (in VS Code: Terminal > New Terminal).
4. Run: `npm run build`
   You should see "Build finished", with 15 pages built.
5. Run: `npm run preview` and open http://localhost:8080. Click through the site (home, MakeX, forms).
   Press Ctrl+C in the terminal to stop it.
6. Upload everything inside the **dist** folder with FileZilla.
   In FileZilla: Transfer > File exists action > "Overwrite if source newer", so unchanged files are skipped.
7. On the live server, delete these if they were uploaded before (they should not be public):
   `Admin.html`, `js/Admin.js`, `text files/`, `.git/`, `.vscode/`. The old `Header.html`, `Footer.html`
   and `Cartdrawer.html` on the server are no longer needed either.
8. Commit to git: `build.js`, `package.json`, `.gitignore`, `HOW-TO-USE.md`, `Components.js`.
   (`dist` is ignored on purpose, it is generated.)

## Every time you change something
1. **Edit your normal files** (for example `Header.html`, `about-us.html`, `css/style.css`).
2. **Run** `npm run build`
3. **Upload the contents of `dist`** with FileZilla.

That's all. Optional: `npm run preview` to look at the result before uploading.

## Rules
- Never edit anything inside `dist`. It is erased and rebuilt every time.
- Never upload the project folder, only `dist`.
- Forgot step 2? Then `dist` still has the old header or page. If a change does not show up on the
  live site, first check you ran `npm run build`, then hard-refresh the browser (Ctrl+F5).

## Adding a new page
Create the page like the others, with these three lines where the header, footer and cart go, and
`<script src="Components.js"></script>` near the end:

    <div id="header-placeholder"></div>
    <div id="footer-placeholder"></div>
    <div id="cart-drawer-placeholder"></div>

The build finds it automatically.

## Opening pages without building
Pages in the project folder still work while you are developing (they load the header/footer like before),
as long as you open them through a local server (for example VS Code "Live Server"). The built `dist` pages
also work when opened as plain files.

## Not wanting some files on the public site
Open `build.js` and look at the `SKIP` list at the top. Anything listed is left out of `dist`.
There are commented examples for the unused media files.

## Later: Vercel or AWS Amplify
You stop uploading by hand. Connect the git repo and set:
- Build command: `npm run build`
- Output directory: `dist`

## Problems
- "npm is not recognized": Node.js is not installed or the terminal needs to be reopened.
- "BUILD FAILED ... placeholder is still empty": the message names the page; check it has the three
  placeholder lines exactly as shown above.
- Header missing on the live site: you probably uploaded the project folder instead of `dist`, or
  uploaded `dist` before building.
