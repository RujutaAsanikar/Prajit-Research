// Builds dist/ for static hosting (GitHub Pages, Netlify, any web server).
// The artifact/preview form of the page lives in src/body.html; this wraps it in a full HTML document.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";

const body = readFileSync("src/body.html", "utf8");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Prajit Research — independent equity research: initiations, updates, and post-mortems built from primary sources.">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Prajit Research">
<meta property="og:description" content="Independent equity research. Patient research for impatient markets.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://prajitresearch.com/">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${body}
</body>
</html>
`;
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
for (const f of ["styles.css", "app.js", "config.js"]) copyFileSync(f, `dist/${f}`);
writeFileSync("dist/.nojekyll", "");
writeFileSync("dist/CNAME", "prajitresearch.com\n");   // tells GitHub Pages which domain this site answers to
console.log("built dist/");
