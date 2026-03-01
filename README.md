# 🎙️ LeadWhisper AI

### *Turn cold professional bios into warm conversations in 3 seconds.*

---

## 📖 Overview

**LeadWhisper AI** is a high-velocity sales intelligence tool built for **Problem Statement 1**. It eliminates the "research tax" that Sales Development Representatives (SDRs) face when reaching out to new leads.

Instead of manually spending 15 minutes per lead, LeadWhisper uses **Gemini 1.5 Flash** to analyze unstructured LinkedIn "About" sections and instantly generate hyper-personalized outreach.

### 🔴 The Problem

Manual lead research is slow and doesn't scale. Generic automation feels "robotic" and gets ignored.

### 🟢 The Solution

LeadWhisper extracts deep business insights (Pain Points) and personal hooks from raw text, generating a 3-sentence email that balances speed with a human-to-human feel.

---

## ✨ Key Features

* **Deep Intelligence Extraction:** Identifies 2 specific professional pain points from any bio.
* **Hyper-Personalized Hooks:** Generates unique icebreakers to prove you've done the work.
* **Multi-Channel Ready:** Optimized for Email, but expandable to LinkedIn and Twitter DMs.
* **One-Click Copy:** Seamlessly move your generated pitch into your outreach tool.
* **Modern UI:** A sleek, dark-mode Glassmorphism dashboard built for high-focus work.

---

## 🛠️ Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | **Next.js 15 (App Router)**, Tailwind CSS |
| **Backend** | **Node.js Edge Runtime** (Next.js Route Handlers) |
| **AI Model** | **Gemini 1.5 Flash-Latest** |
| **Validation** | **Zod** (Strict JSON schema enforcement) |
| **Icons** | **Lucide-React** |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* A Google AI Studio API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repo:**
```bash
git clone https://github.com/vaishaldsouza/LeadWhisper.git
cd leadwhisper-ai

```


2. **Install dependencies:**
```bash
npm install

```


3. **Set up environment variables:**
Create a `.env.local` file in the root:
```env
GEMINI_API_KEY=your_api_key_here

```


4. **Run the development server:**
```bash
npm run dev

```


5. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

---

## 🧠 Key Technical Decisions

* **Stateless by Design:** I chose a stateless architecture to ensure sub-second response times. Without a database bottleneck, the SDR can generate 100+ leads in minutes.
* **Strict JSON Mode:** By forcing Gemini into JSON mode and validating with Zod, the app is "uncrashable"—even if the AI returns unexpected text.
* **Vercel Edge Deployment:** The app is optimized for edge deployment, placing the compute as close to the user as possible.

---

## 🛤️ Future Roadmap

* **Vercel Postgres Integration:** For persisting lead history and campaign tracking.
* **Chrome Extension:** To generate pitches directly while browsing LinkedIn profiles.
* **Voice Notes:** Using ElevenLabs to turn the "Hook" into a personalized audio message.
