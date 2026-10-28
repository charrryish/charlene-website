CHARLENE JOY — PERSONAL WEBSITE v6 (grouped layout)

FILES
- index.html : the whole one-page site
- style.css  : colors, layout, light/dark mode, responsive design
- script.js  : navigation, tabs, mood picker, quiz, charlene.exe, memories, explorer
- images/    : put ALL your photos here (copy your existing images folder into it)

HOW TO OPEN
Keep index.html, style.css, script.js and the images folder together, then open index.html.
Internet is needed only for Google Fonts and the YouTube/Spotify/Google links.

HOW THE PAGE IS GROUPED (so it is shorter and easier to scan)
Top menu -> About | Portfolio | My World | Play | Find me
- About     : My story / Skills / Wishlist
- Portfolio : Achievements / Projects (with photos)
- My World  : K-pop / K-drama / Coffee / Dance / Nature / Memories
- Play      : charlene.exe / Fun quiz / Leave a note
Each group is ONE section with tabs, so visitors open only what they want.

UNIQUE INTERACTIONS
1. Pick a mood, find my world: the whole page tint changes and it links to the matching tab.
2. Explore my world (top-right "✦ 0/5"): five little things to find; 5/5 gives a surprise.
3. charlene.exe, Behind the build, Tap a memory, Spanish latte egg, quiz confetti, leave a note.

PHOTOS: FILENAMES (copy into images/ with these exact names)
Already in your project: charlene.jpg, hero-sunset.jpg, seventeen.jpg, stray-kids.jpg, my-coffee.jpg,
  my-dance.jpg, my-mountain.jpg, my-sea.jpg, my-sunset.jpg, my-people.jpg, memory-one.jpg,
  memory-two.jpg, kdrama-coffee.jpg, ahof-fanmeet.jpg, nature-me.jpg
NEW - Achievements:  liturgy.jpg, stayology.jpg, journalism.jpg, tech.jpg
NEW - Projects:      project-website.jpg, project-grabnkaon.jpg, project-ledger.jpg, project-python.jpg
NEW - K-dramas:      kd-queen-of-tears.jpg, kd-crash-landing-on-you.jpg, kd-hometown-cha-cha-cha.jpg,
                     kd-weightlifting-fairy.jpg, kd-welcome-to-waikiki.jpg, kd-reply-1988.jpg,
                     kd-doctor-x.jpg, kd-hotel-del-luna.jpg, kd-dr-romantic.jpg
Missing Achievement/Project/K-drama photos simply keep a colorful card, so nothing looks broken.
Tips: JPG, under ~500 KB each. Portrait (tall) images work best for K-drama posters; wide images
for achievements and projects. Use posters/photos you are allowed to use in a school activity.

THINGS TO EDIT
- Text: index.html (search for the heading you want to change).
- Quiz questions: script.js, the "quiz" array.
- Mood messages, charlene.exe commands, memory stories: script.js.

WHAT WAS FIXED FROM THE PREVIOUS VERSION
- script.js stopped at the first lines (it looked for a theme label that no longer existed), so nothing interactive ran.
- The mobile-menu CSS was outside its @media block, which hid the top menu on desktop and left a blank left margin.
- The old scroll highlight looked for a removed sidebar.

PRIVACY
Only publish contact details and photos you are comfortable sharing. Ask permission before posting other people's photos.


================ v7 ADD-ONS ================
NEW FILES: v7.css and v7.js (keep them next to index.html; index.html already links them)
1. Pick a mood: the hero button opens Cafe / Sunset / Stan / Press mode (also a small dock bottom-left).
2. Typed "I'm ___" line: edit the roles array in script.js.
3. Joke stats under the hero, with count-up and a hover coffee bar.
4. Loading intro (coffee cup + terminal). Click anywhere to skip.
5. Scrapbook photos: drag them, double-click to snap back; sticker facts live in v7.js (facts array).
6. Cursor with sparkle trail (mouse devices only).
7. Three secrets: type "kpop", click the name 3 times, press D.
8. Personal changelog card in the hero (index.html, class "changelog").
9. Scroll surprise: golden hour -> dusk -> night with stars near the footer.
Explore counter is now 0/6 (the mood switcher counts).
