Fondazione C.R.I.S.T.O. — Static Website
=========================================

This is a plain static website (HTML + CSS + JS + images).
No build step, no server, no database — just upload and go.

Folder structure
----------------
  index.html          Main page (edit text here)
  css/
    style.css         All styles (edit colors/spacing/typography here)
  js/
    script.js         All interactions (preloader, menu, reveals, cookie banner)
  images/             All photos, logos, portraits (replace files 1:1)

Deploy on shared hosting (cPanel / phpMyAdmin server)
-----------------------------------------------------
1. Open cPanel → File Manager → public_html (or your domain root).
2. Delete/backup the old site files.
3. Upload the ENTIRE contents of this folder (index.html + css/ + js/ + images/)
   into public_html. Do NOT upload the outer folder itself — upload what's inside.
4. Visit your domain. Done.

Editing in VS Code
------------------
- Change words:       edit index.html
- Change colors:      edit :root variables at the top of css/style.css
- Change images:      replace files in images/ using the same filenames
- Change animations:  edit js/script.js and the ".preloader" / ".reveal" blocks in style.css

Fonts
-----
Loaded from Google Fonts (Poppins + Fraunces) via <link> in index.html.
No local font files needed.

