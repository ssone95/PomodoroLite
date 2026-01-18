# Pomodoro Lite 🍅

A beautiful, minimal Pomodoro timer Progressive Web App (PWA) built with React and TypeScript.

🌐 **[Try it live →](https://ssone95.github.io/PomodoroLite)**

![Pomodoro Lite](https://img.shields.io/badge/PWA-Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🎨 Beautiful UI** - Gradient backgrounds that change based on timer mode
- **⏱️ Custom Timers** - Create, edit, and delete your own timer presets
- **🕐 Clock Picker** - Intuitive circular dial for setting timer duration
- **📱 PWA Support** - Install on your device for offline use
- **🔒 Wake Lock** - Keeps your screen awake during active timers
- **📳 Haptic Feedback** - Vibration feedback on mobile devices
- **🔔 Sound Notifications** - Audio alert when timer completes
- **💾 Persistent Storage** - Timer configurations saved to localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ssone95/PomodoroLite.git
cd PomodoroLite

# Install dependencies
npm install

# Start development server
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Builds the app to the `build` folder, optimized for production.

## 🌐 Deployment
If you want to deploy it yourself - here are a few options. 
> I'd recommend going with Github Pages, since it's the simplest, and fastest variant, as this app has no external service dependencies.

### GitHub Pages

1. Update `homepage` in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/PomodoroLite"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Vercel

1. Push the code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Create React App - just click Deploy!

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Netlify

1. Push the code to GitHub
2. Go to [netlify.com](https://netlify.com) and import your repository
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`

Or drag and drop the `build` folder to Netlify!

For SPA routing, create `public/_redirects`:
```
/*    /index.html   200
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Timer.tsx          # Main timer display
│   ├── Timer.css          # Timer styles
│   ├── Settings.tsx       # Timer settings page
│   ├── ClockPicker.tsx    # Circular time picker
│   ├── TimerEditModal.tsx # Add/edit timer modal
│   └── CompletionModal.tsx # Timer complete popup
├── hooks/
│   ├── useTimer.ts        # Timer logic
│   ├── useWakeLock.ts     # Screen wake lock
│   ├── usePageVisibility.ts # Page visibility API
│   ├── useSound.ts        # Audio notifications
│   └── useTimerConfig.ts  # localStorage persistence
├── App.tsx
├── App.css
└── index.tsx
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Workbox** - Service worker for PWA
- **Wake Lock API** - Keep screen awake
- **Web Audio API** - Sound notifications
- **Vibration API** - Haptic feedback

## 📱 PWA Features

This app works offline and can be installed on your device:

- **iOS**: Open in Safari → Share → Add to Home Screen
- **Android**: Chrome will prompt to install, or Menu → Add to Home Screen
- **Desktop**: Click install icon in address bar

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔔 Developer Note

This project was born out of frustration with the current state of Pomodoro apps:

- 🚫 **No ads** - Ever
- 🚫 **No paywalls** - All features are free
- 🚫 **No "upgrade to premium" popups** - What you see is what you get
- 🚫 **No tracking or analytics** - Your data stays on your device
- 🚫 **No cloud dependencies** - Works entirely offline after first load

Just a single static deployment and your browser — that's it.

This is a pet project that came from a bit of free time and a lot of dissatisfaction with existing solutions. It was designed to be **lightweight**, **fast to build**, and **pleasant to use**.

> **Note:** There's no cloud sync by design. Your timer configurations are stored in your browser's localStorage. This keeps things simple and private.
## 📄 License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

### Summary (non-legal):
- ✅ Free for personal use and self-deployment
- ✅ Free to fork and modify for non-commercial purposes
- ❌ No selling
- ❌ No subscriptions
- ❌ No paid hosting or SaaS
- ❌ No app-store monetization
- ❌ Any kind of monetization is strictly forbidden

See the [LICENSE](LICENSE) file for full terms.

---

Made with ❤️ and 🍅
