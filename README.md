# ✈️ Travel Tournament

A mobile-first web app for groups of friends to decide their next travel destination via a 16-country single-elimination tournament.

## Features

- 🗺️ **Country Selection** — Search and pick exactly 16 countries from 70+ options
- 🏟️ **Tournament Bracket** — Round of 16 → Quarter Finals → Semi Finals → Final
- 🎯 **Matchup Voting** — Tap the country you'd rather visit; winner advances automatically
- 🏆 **Winner Screen** — Confetti celebration + share via Web Share API or clipboard
- 🔊 **Sound Effects** — Satisfying chimes on each vote using Web Audio API
- 🎲 **Random Pick** — "Can't decide?" button for tough matchups
- 📊 **Full Bracket View** — Toggle between matchup view and the complete bracket tree
- 🌙 **Dark Mode** — Deep space aesthetic, mobile-optimized

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone or unzip the project
cd travel-tournament

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser (or scan the QR code in your terminal for mobile preview).

---

## 📦 Deployment

### Option 1: Vercel (Recommended — easiest, free)

**Via Vercel CLI:**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
cd travel-tournament
vercel

# Follow the prompts:
# - Set up and deploy? → Y
# - Which scope? → Your account
# - Link to existing project? → N
# - Project name? → travel-tournament (or any name)
# - In which directory is your code located? → ./
# - Want to override the settings? → N

# Your app is now live at https://travel-tournament-xxxx.vercel.app
```

**Via GitHub (auto-deploy on every push):**

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/travel-tournament.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo

3. Settings are auto-detected (Vite). Click **Deploy**.

4. Every `git push` to `main` will auto-redeploy. ✅

---

### Option 2: Netlify (also free)

**Via Netlify CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Via Netlify UI:**

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Deploy manually**
2. Run `npm run build` locally
3. Drag the `dist/` folder into the Netlify drop zone
4. Your app is live instantly!

**For auto-deploy from GitHub:**

1. Connect your repo at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`

---

### Option 3: GitHub Pages

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Add homepage to vite.config.js:
# base: '/travel-tournament/'   ← your repo name

# Deploy
npm run deploy
```

Access at: `https://YOUR_USERNAME.github.io/travel-tournament`

---

### Option 4: Static file hosting (any CDN/server)

```bash
npm run build
# Upload the contents of the dist/ folder to any static host
# (AWS S3 + CloudFront, Cloudflare Pages, Firebase Hosting, etc.)
```

---

## 📱 Using on Mobile

Once deployed, simply:
1. Open the URL on your phone
2. Tap **Share → Add to Home Screen** (iOS Safari) or **Install app** (Android Chrome)
3. The app works offline-first and behaves like a native app

For group sessions, share the URL with your friends — everyone can vote together in real time on their own devices!

---

## 🗂️ Project Structure

```
travel-tournament/
├── index.html                  # App entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                 # Vercel SPA routing config
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Screen router (selection → tournament → winner)
    ├── index.css               # Tailwind + custom CSS
    ├── data/
    │   └── countries.js        # 70+ countries with flag emojis
    ├── utils/
    │   └── sound.js            # Web Audio API sound effects
    └── components/
        ├── CountrySelection.jsx  # Pick 16 countries screen
        ├── Tournament.jsx        # Bracket logic + round management
        ├── Matchup.jsx           # Individual country vs country UI
        ├── BracketView.jsx       # Full bracket visualization
        └── WinnerScreen.jsx      # Confetti + winner reveal
```

---

## 🛠️ Customization

**Add more countries** — Edit `src/data/countries.js`

**Change tournament size** — Edit `TARGET = 16` in `CountrySelection.jsx` and update `initBracket()` in `Tournament.jsx` accordingly

**Swap color scheme** — Update the `cosmos` colors in `tailwind.config.js` and `glow-*` classes in `index.css`

**Modify sound effects** — Edit `src/utils/sound.js` (uses Web Audio API, no external files needed)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 11 | Animations & transitions |
| react-confetti | Winner celebration |
| Web Audio API | Sound effects (zero dependencies) |
| Web Share API | Native share sheet on mobile |
