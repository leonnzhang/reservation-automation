# Minto Reservation Automation

A CLI software that fully automates the reservation process of sports/activities on the minto reservation website. Was used during Covid to take those highly coveted Sunday night volleyball spots! Developed in early 2022. Code isn't clean, but it worked great (seriously needs error handling though). Light documentation follows, may be cleaned up one day.

## Documentation

- **Currently needs Recaptcha v3 token generator. Old one stopped working but it shouldn't be hard to make a quick chrome extension or headless browser to farm tokens. All API endpoints for the token collector are in the `captcha/api.js`**
- Profiles can be generated through the 'Config' option in the CLI. Generated profiles will be put to a `config.json` file.
- Theoretically an unlimited number of profiles can be loaded into `profiles.json` for an unlimited number of tasks, however I wouldn't recommend it.
- The `captchaAPI()` and `captchaGenerator()` start automatically when you start the bot. I recommend you start automation approximately 30-60 seconds before the release time of new time slots to make sure you have enough captcha tokens for your tasks.
- Do remember that Google's Recaptcha v3 tokens expire 120 seconds after generation.