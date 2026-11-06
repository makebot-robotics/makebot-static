#!/usr/bin/env node
/*
 * Makebot site builder
 * --------------------
 *   npm run build      builds the finished website into the "dist" folder
 *   npm run preview    builds, then opens a local preview at http://localhost:8080
 *
 * What it does:
 *   1. Takes every page (.html) and puts Header.html, Footer.html and
 *      Cartdrawer.html directly inside it (into the three placeholder boxes).
 *   2. Copies everything else (css, js, images, videos...) unchanged.
 *   3. Leaves out files that should never be public (see SKIP below).
 *
 * Your source files are never modified. "dist" is wiped and rebuilt each time,
 * so never edit anything inside dist by hand.
 *
 * No extra packages needed, only Node.js 16 or newer.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// placeholder id  ->  file that goes inside it
const FRAGMENTS = {
  'header-placeholder': 'Header.html',
  'footer-placeholder': 'Footer.html',
  'cart-drawer-placeholder': 'Cartdrawer.html'
};

// Not copied into dist. Names ending in "/" are whole folders. Paths use "/".
const SKIP = [
  // tools / private / generated
  '.git/', '.vscode/', '.idea/', 'node_modules/', 'dist/',
  'text files/',                       // your private notes
  'Admin.html', 'js/Admin.js',         // admin page: keep off the public site
  'package.json', 'package-lock.json', 'build.js', '.gitignore',
  // already inside every page after the build
  'Header.html', 'Footer.html', 'Cartdrawer.html'
  // Unused media you may not want to upload (remove the // to skip them):
  // , 'demo_videos/BANNER-VIDEO.mp4'
  // , 'demo_videos/file_example_MP4_480_1_5MG.mp4'
  // , 'event_images/beeevent.png'
  // , 'demo_images/Makeblock_STEAM_Robot_Kits.jpg'
];
const SKIP_PATTERNS = [/\.zip$/i, /\.md$/i, /(^|\/)\.DS_Store$/i, /(^|\/)Thumbs\.db$/i];

// ---------------------------------------------------------------------------

const skipLower = SKIP.map(s => s.toLowerCase());
function isSkipped(rel) {
  const r = rel.toLowerCase();
  for (const s of skipLower) {
    if (s.endsWith('/') ? (r + '/').startsWith(s) || r.startsWith(s) : r === s) return true;
  }
  return SKIP_PATTERNS.some(p => p.test(rel));
}

function walk(dir, base, list) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? base + '/' + entry.name : entry.name;
    if (isSkipped(entry.isDirectory() ? rel + '/' : rel)) continue;
    if (entry.isDirectory()) walk(path.join(dir, entry.name), rel, list);
    else if (entry.isFile()) list.push(rel);
  }
  return list;
}

function fail(msg) {
  console.error('\nBUILD FAILED: ' + msg + '\n');
  process.exit(1);
}

function readFragments() {
  const out = {};
  let newest = 0;
  for (const id of Object.keys(FRAGMENTS)) {
    const file = path.join(ROOT, FRAGMENTS[id]);
    if (!fs.existsSync(file)) fail(FRAGMENTS[id] + ' not found next to build.js');
    let t = fs.readFileSync(file, 'utf8');
    if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);
    out[id] = t.replace(/\r\n/g, '\n').trim();
    newest = Math.max(newest, fs.statSync(file).mtimeMs);
  }
  return { text: out, newest };
}

function build() {
  const started = Date.now();
  const fragments = readFragments();

  if (path.resolve(OUT) === path.resolve(ROOT) || !path.resolve(OUT).startsWith(path.resolve(ROOT))) {
    fail('unexpected output folder');
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = walk(ROOT, '', []);
  let pages = 0, copied = 0, bytes = 0;
  const problems = [];

  for (const rel of files) {
    const src = path.join(ROOT, rel);
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const st = fs.statSync(src);
    let mtime = st.mtimeMs;

    if (/\.html?$/i.test(rel)) {
      let buf = fs.readFileSync(src);
      const bom = buf.length > 2 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
      let html = buf.slice(bom ? 3 : 0).toString('utf8');
      const crlf = html.includes('\r\n');
      let inlined = 0;

      for (const id of Object.keys(FRAGMENTS)) {
        const re = new RegExp('(<div\\s+id=["\']' + id + '["\'][^>]*>)(\\s*)(</div>)', 'i');
        if (re.test(html)) {
          let text = fragments.text[id];
          if (crlf) text = text.replace(/\n/g, '\r\n');
          const nl = crlf ? '\r\n' : '\n';
          html = html.replace(re, (m, open, ws, close) => open + nl + text + nl + close);
          inlined++;
        }
      }

      // Safety check: no empty placeholder may be left behind.
      for (const id of Object.keys(FRAGMENTS)) {
        const left = new RegExp('<div\\s+id=["\']' + id + '["\'][^>]*>\\s*</div>', 'i');
        if (left.test(html)) problems.push(rel + ': placeholder "' + id + '" is still empty');
      }

      if (inlined > 0) {
        pages++;
        // A change to header/footer/cart makes every page count as "newer" (handy for FileZilla).
        mtime = Math.max(mtime, fragments.newest);
      }
      const out = Buffer.from(html, 'utf8');
      fs.writeFileSync(dest, bom ? Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), out]) : out);
      bytes += out.length;
    } else {
      fs.copyFileSync(src, dest);
      bytes += st.size;
    }
    copied++;
    const t = new Date(mtime);
    fs.utimesSync(dest, t, t); // keep original dates so unchanged files are not re-uploaded
  }

  if (problems.length) fail('\n  ' + problems.join('\n  '));

  const mb = (bytes / 1024 / 1024).toFixed(1);
  console.log('\nBuild finished in ' + ((Date.now() - started) / 1000).toFixed(1) + 's');
  console.log('  Pages with header/footer built in : ' + pages);
  console.log('  Files in dist                     : ' + copied + ' (' + mb + ' MB)');
  console.log('  Upload everything inside the "dist" folder.\n');
}

// ------------------------------ preview server ------------------------------
function serve() {
  const http = require('http');
  const PORT = Number(process.env.PORT) || 8080;
  const TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8', '.woff': 'font/woff', '.woff2': 'font/woff2'
  };
  http.createServer((req, res) => {
    let p;
    try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { p = '/'; }
    if (p.endsWith('/')) p += 'index.html';
    const file = path.normalize(path.join(OUT, p));
    if (!file.startsWith(OUT)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
      const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (range) {
        let start = range[1] ? parseInt(range[1], 10) : 0;
        let end = range[2] ? parseInt(range[2], 10) : st.size - 1;
        if (start > end || end >= st.size) { res.writeHead(416); return res.end(); }
        res.writeHead(206, {
          'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + st.size
        });
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
      fs.createReadStream(file).pipe(res);
    });
  }).listen(PORT, () => {
    console.log('Preview running at http://localhost:' + PORT + '   (press Ctrl+C to stop)');
    console.log('This shows the built "dist" folder. After editing files, stop it and run again.\n');
  });
}

build();
if (process.argv.includes('--serve')) serve();
