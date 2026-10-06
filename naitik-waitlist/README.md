# Stealth Waitlist Landing Page

A modern, high-conversion, futuristic waitlist landing page for **Naitik** (14-year-old developer from India 🇮🇳 building ambitious products with AI, code, and curiosity).

Designed with a mysterious, premium stealth startup aesthetic that generates intrigue while keeping the core product unrevealed.

---

## ✨ Features & Design Highlights

- **Stealth Startup Aesthetic**: Obsidian/dark palette with subtle ambient glows, glowing gradients, and fine glassmorphism borders.
- **Hero Section**:
  - Live pulse status: *"Building in public from India 🇮🇳"*
  - Main headline: *"I'm 14. And I'm building something insane."*
  - Subheadline: *"Something I've been working on quietly. I'm not ready to reveal everything yet — but if you want to be one of the first to see it, join the waitlist."*
  - Primary CTA: *"Join the Waitlist →"* with smooth scroll and input auto-focus.
  - Secondary reassurance: *"No spam. Just the launch."*
  - Interactive 3D holographic orb with rotating planetary rings and floating quantum nodes.
- **Dynamic Micro-Interactions**:
  - Interactive canvas dust / constellation particles reacting to cursor proximity.
  - Mouse-tracking spotlight lighting on cards (Linear / Raycast / Vercel style).
- **Waitlist System**:
  - Validated Name & Email inputs.
  - Duplicate email detection with friendly notices and shake animation.
  - Realistic loading state with animated spinner.
  - Confetti burst celebration upon joining!
  - Success state: *"You're on the list 🚀"* + Early Access VIP Pass ticket with order number (`#001`), share on X button, and reset option.
- **Curiosity Cards**:
  - `01 — Early Access`: *"Get access before the public launch."*
  - `02 — First Look`: *"Be among the first to see what I'm building."*
  - `03 — Build With Me`: *"Follow the journey from idea to launch."*
- **Founder Section**:
  - Minimalist founder card with India flag 🇮🇳, *"Built by Naitik"*, *"Building in public"* pill, and tech focus badges.
- **Final CTA**:
  - *"Want to see what I'm building?"* with high-contrast glowing CTA.
- **Data Persistence & Admin Tools**:
  - Auto-saves to `localStorage` (works 100% standalone, no server required).
  - Built-in zero-dependency Node server stores signups to `waitlist.json` via REST API.
  - Built-in Admin Drawer (`Alt + W` or click *"Waitlist Data ↗"* in the footer) to inspect subscribers and export as CSV.

---

## 🚀 How to Run

### Option 1: Run with Node.js Server (Recommended)

```bash
cd C:\Users\Hp\.gemini\antigravity\scratch\naitik-waitlist
node server.js
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Open Directly in Any Browser
Double-click `index.html` or open it with any web browser. Everything works standalone!

---

## 🌐 Deploying to Production

You can deploy this in 30 seconds to any modern host:
- **Vercel / Netlify / Cloudflare Pages**: Simply upload the directory or push to GitHub.
- **GitHub Pages**: Set the repository source to the branch root.
