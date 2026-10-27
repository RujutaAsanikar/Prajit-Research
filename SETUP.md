# prajitresearch.com — go-live checklist

Everything in this folder is finished and already set to your details:

- Admins: **ruju25a@gmail.com** and **prajitresearch@gmail.com** (nobody else can ever open the admin page)
- Domain: **prajitresearch.com**
- Contact email shown on the site: prajitresearch@gmail.com

Nothing below costs money. Two free accounts are needed, and only you can create them. Do the steps in order; each takes a few minutes.

---

## Step 1 — Database (Supabase, free)

The database stores writeups, member accounts, and view counts, and decides who may see what.

1. Go to **supabase.com** → **Start your project** → sign up (use prajitresearch@gmail.com so the account belongs to the business).
2. Click **New project**. Name: `prajit-research`. Database password: make a strong one and keep it in a password manager — you'll rarely need it and it is never typed into the site. Region: closest to your readers. Click **Create**; wait a minute.
3. In the left sidebar click **SQL Editor** → **New query**.
4. Open the file `supabase/schema.sql` from this folder in any text editor, select all, copy, paste into the query box, click **Run**. You should see "Success". (Safe to run again later — if you already ran it once before, re-run it now to pick up the email+password sign-in support added since.)
5. Sidebar → **Project Settings** (gear icon) → **API**. Copy two things:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long string)
   These are designed to be public — security comes from the rules the SQL just created.
6. Paste both values into the chat with me, **or** open `config.js` and fill in `supabaseUrl` and `supabaseAnonKey`, then copy `config.js` over `dist/config.js`. (`dist/config.js` is the one that's actually live on the site — the root `config.js` is kept blank on purpose so a local preview always runs in safe demo mode. Rebuilding the site with `node build.mjs` won't ever overwrite `dist/config.js` once it exists, so your real keys are safe there.)

## Step 2 — Put the site on the internet (GitHub Pages, free)

Already done — the repository exists, and it rebuilds and republishes itself automatically every time
files are updated (via `.github/workflows/deploy.yml`, under **Settings → Pages → Source: GitHub Actions**).
Nothing to do here. If you ever need to double-check it's running: repository → **Actions** tab → the latest
"Build and deploy site" run should show a green checkmark.

## Step 3 — Connect prajitresearch.com

1. Same **Settings → Pages** screen → **Custom domain** box → type `prajitresearch.com` → **Save**.
2. Now go to the company where the domain was bought (GoDaddy, Namecheap, Google Domains, etc.) → find **DNS settings** / **Manage DNS** for prajitresearch.com.
3. Add these records (GitHub also shows them on the Pages screen — if theirs differ, use theirs):

   | Type | Host / Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<your-github-username>.github.io` |

   Delete any old A or CNAME records for `@` and `www` that the registrar added by default ("parking" pages).
4. Back on GitHub **Settings → Pages**, wait for the green "DNS check successful" (a few minutes to an hour). **Enforce HTTPS** is already turned on.
5. Open **https://prajitresearch.com** — the site should load with the padlock.

## Step 4 — Tell the database the site's address

1. Supabase → sidebar **Authentication** → **URL Configuration**.
2. **Site URL**: `https://prajitresearch.com`
3. **Redirect URLs** → add: `https://prajitresearch.com` and `https://prajitresearch.com/**`
4. Save. Sign-in links only work for addresses listed here.

## Step 5 — First sign-in (makes you admin)

1. On prajitresearch.com click **Sign in** → **Create account** → sign up with `ruju25a@gmail.com` (or the prajitresearch one) and a password.
2. Check that inbox and click the confirmation link — you land back on the site, signed in; **Admin** appears in the top menu. (If email confirmation isn't set up yet — see Step 6 — you may be signed in immediately instead; that's fine too.)
3. **Admin → Writeups**: there is one example draft. Edit or delete it, then add real writeups. For each: title, summary (everyone sees this), body (only entitled readers see this), sector, type, **who can read it** (Free / Member / Subscriber), optional PDF, and **Status = Published** when ready.
4. Abhijit signs up the same way with prajitresearch@gmail.com and is also admin.

Readers can still sign in without a password too, via "email me a one-time link" on the sign-in page — that path never creates a new account by itself, only existing ones use it.

## Step 6 — Before real readers arrive

- **Email delivery — now a hard requirement, not optional.** Supabase's built-in email is for testing only — a few messages per hour. Sign-up confirmation emails and password-reset emails will hit that limit almost immediately once real readers show up. Sign up for a free sender (Resend or Brevo), then Supabase → **Authentication → SMTP Settings** → enable custom SMTP and paste the details they give you. About ten minutes.
- **Sign-in security settings** — Supabase → **Authentication → Providers → Email**:
  - **Confirm email** = ON (readers must click the confirmation link before they can sign in).
  - **Secure email change** = ON.
  - Under **Authentication → Policies** (or your dashboard's password-policy section): set **Minimum password length** to `12`, and turn on **leaked password protection** if your plan offers it.
- **Bot protection (recommended, optional for now).** The sign-up and forgot-password pages support Cloudflare Turnstile (a free, privacy-friendly captcha) — get a site key + secret key at [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile, paste the secret key into Supabase → **Authentication → Attack Protection**, and send me the site key so I can add it to `config.js`. Until you do this, sign-up simply has no captcha — not broken, just unprotected.
- **Content placeholders.** In `app.js` under `SITE`: the founder bio is currently "Founder bio coming soon." — send me the real bio and I'll update it. The homepage stats row now computes the writeups-published count live, so nothing to fix there. "Pricing on request" on the Subscriber plan — let me know if you want a real number instead.
- **Legal.** Have counsel read the Disclaimer and Copyright pages once.

## Giving Abhijit access to the accounts too

- **Site admin**: already done — both emails are admins.
- **Supabase**: Organization settings → **Team** → invite prajitresearch@gmail.com or his personal email.
- **GitHub**: repository → **Settings → Collaborators** → add his GitHub username.
- Whoever holds the domain registrar login keeps it; DNS only needs setting once.

## How subscriptions work for now

There is no card payment on the site yet. When someone pays you (invoice, bank transfer, a Stripe payment link you send them), open **Admin → Members** and switch their access to **Subscriber**, or approve their request under **Admin → Requests**. Card checkout can be added later.

## Updating the site later

- **Writeups, members, requests**: all inside the admin, no files involved.
- **Copy or design**: send me the change; I push the update to the repository and it goes live automatically within about a minute.

## What the security actually does

| Abhijit's requirement | How it is enforced |
|---|---|
| Admin login | Email+password sign-in; only the two listed emails get the admin flag; the database refuses to let anyone else set it |
| Reader passwords | Handled entirely by Supabase Auth — passwords are hashed there and never stored in, or visible to, this site's own database |
| Upload / edit / manage documents | Admin desk; PDFs go to a private storage area only entitled readers can download |
| Customer access management | Admin → Members (change level), Admin → Requests (approve/decline) |
| Guest / Login / Subscription | Free / Member / Subscriber levels; gated text is never sent to a browser that isn't entitled |
| View counts | Every open of a published note is logged; only admins can read the log |
| Disclaimer / Copyright | Static pages, linked in the footer and under every note |

The rules are tested (`supabase/test/10-tests.sql`): guests, members, subscribers, and admins each see exactly what they should.
