# ChickenFarm - GitHub Pages + Google Sheets (Free MVP)


A free, working Minimum Viable Product (MVP) for your chicken breeding system using a static GitHub Pages site connected to a Google Sheet backend via Google Apps Script.


## What it does (MVP)
- Collects survey data, budget entries, and farm daily records from a web form.
- Stores submissions into a Google Sheet.
- Reads and displays data in a live table on your GitHub Pages site.
- Allows download/export of displayed data as CSV.
- Basic Update/Delete supported (via row index) — works but requires careful access settings.


## Files
- `index.html` — main static page (forms + table + charts placeholder).
- `styles.css` — simple styles.
- `app.js` — frontend logic, calls Google Apps Script web app.
- `google-apps-script.gs` — server script (paste into Google Apps Script editor and deploy as web app).


## Step-by-step setup (do this first)
1. Create a new Google Sheet. Name the sheet `data` (or change names inside script).
2. Create header row in the first sheet (row 1):
`timestamp,category,type,field1,field2,field3,notes`
(You can edit fields to match your needs; index.js and the script assume these headers.)
3. Open **Extensions -> Apps Script** in the Google Sheet.
4. Replace the Code.gs content with the `google-apps-script.gs` content from this repo.
5. Save the project.
6. Deploy -> New deployment -> Select "Web app".
- Execute as: **Me** (your Google account)
- Who has access: **Anyone** (or "Anyone, even anonymous")
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AAA.../exec`
8. In `app.js` replace `const SCRIPT_URL = 'PASTE_YOUR_SCRIPT_URL_HERE'` with your web app URL.
9. Create a GitHub repo and push the files (`index.html`, `styles.css`, `app.js`).
10. Enable GitHub Pages (branch: `main`, folder: `/`) and open your site URL.


## Usage notes & security
- For the Apps Script web app to accept requests from your GitHub Pages site, the web app must be deployed with access "Anyone, even anonymous". This is required for a fully public frontend without OAuth. It makes the API public — **anyone who knows the endpoint can submit requests**. Don't publish the endpoint openly if you're concerned about spam.
- For stronger security later, we'll upgrade to Firebase (free tier) or Supabase for auth and secure CRUD.


## If you hit CORS issues
- Most of the time, Apps Script web apps work with `fetch()` from static pages when deployed as described above. If you see CORS errors in the browser console, consider switching to Firebase or using Apps Script ContentService to return JSON and confirm deploy settings.


## Next steps (optional)
- Add user authentication (Firebase Auth) to allow only you and your girlfriend to edit/delete.
- Add charts for feed/cost trends (we included a placeholder for Chart.js).
- Migrate to Supabase for full CRUD + role-based access without making endpoint public.# chicken-farm-system
