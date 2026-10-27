// Builds dist/ for static hosting (GitHub Pages, Netlify, any web server).
// The artifact/preview form of the page lives in src/body.html; this wraps it in a full HTML document.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";

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
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://challenge.cloudflare.com; worker-src 'self' blob:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.supabase.co https://challenge.cloudflare.com https://cdn.jsdelivr.net; frame-src https://challenge.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self';">
<meta name="referrer" content="strict-origin-when-cross-origin">
</head>
<body>
${body}
</body>
</html>
`;
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
for (const f of ["styles.css", "app.js", "motion.js", "admin.css"]) copyFileSync(f, `dist/${f}`);
// dist/config.js holds the real deployed keys once the site is live — a rebuild must never silently
// blank them out again. Only seed it from the (demo) root config.js the first time it doesn't exist yet.
if (!existsSync("dist/config.js")) copyFileSync("config.js", "dist/config.js");
writeFileSync("dist/.nojekyll", "");
writeFileSync("dist/CNAME", "prajitresearch.com\n");   // tells GitHub Pages which domain this site answers to
console.log("built dist/");
