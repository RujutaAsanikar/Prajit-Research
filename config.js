/* Prajit Research — site configuration.
   Leave supabaseUrl/supabaseAnonKey empty to run in DEMO MODE (sample data, nothing saved).
   Fill them in from Supabase → Project Settings → API to go live.
   The anon key is designed to be public; access is enforced by database rules, not by hiding this key. */
window.PRAJIT_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  brand: "Prajit Research",
  established: "2026",
  contactEmail: "hello@example.com",
  // Optional: a Cloudflare Turnstile site key to show a captcha on sign-up and forgot-password.
  // Leave blank to skip the captcha entirely — nothing breaks either way.
  turnstileSiteKey: ""
};
