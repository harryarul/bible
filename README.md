# 📜 The Book of Romans — Interactive Bible Study

An interactive, mobile-friendly web app for studying all **16 chapters** of Paul's letter to the Romans. Built for **Christian maturity** and **small-group Bible study** — works on phones, tablets, and computers, and runs fully offline once loaded.

> *"I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes."* — Romans 1:16

---

## 🔗 Live Demo

Once published (see [Publishing to GitHub Pages](#-publishing-to-github-pages) below), your app will be available at:

```
https://<your-username>.github.io/<your-repo-name>/
```

---

## ✨ Features

- **All 16 chapters** of Romans, each with its own page
- **Doodle-style concept cards** highlighting Paul's key teachings, colour-coded by theme
- **Five tabs per chapter:**
  - 🎨 **Concepts** — the core ideas Paul teaches
  - 📖 **Verses** — the key verse plus supporting scriptures
  - 📜 **Teaching** — a plain-language explanation of the chapter
  - 💬 **Discussion** — small-group questions with tap-to-reveal facilitator notes
  - 🙏 **Reflection** — a closing prayer and personal-application prompts
- **Read the full chapter text** in a floating, scrollable window
  - Switch between **Plain English** (Bible in Basic English) and **KJV** — both public domain
  - One-tap **“Open in NIV on BibleGateway”** link for the official NIV
- **Overview page** with the letter's structure; tap any section to read those chapters
- **Mobile menu** (☰) for easy chapter navigation on phones
- **Single self-contained file** — no build step, no dependencies, works offline

---

## 🚀 Publishing to GitHub Pages

You only need **one file**: `index.html`.

### Option A — Through the GitHub website (easiest)

1. **Create a repository**
   - Go to [github.com/new](https://github.com/new)
   - Give it a name (e.g. `romans-study`), set it to **Public**, and click **Create repository**.

2. **Upload the app file**
   - On the repo page, click **Add file → Upload files**.
   - Drag in `index.html` (the study app). *Make sure it is named exactly `index.html`.*
   - You can also upload this `README.md`.
   - Click **Commit changes**.

3. **Turn on GitHub Pages**
   - Go to **Settings → Pages** (left sidebar).
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Under **Branch**, select **`main`** and folder **`/ (root)`**, then click **Save**.

4. **Wait ~1 minute**, then refresh the Pages settings screen. Your live link will appear at the top:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

5. **Share it** — paste that link into WhatsApp, email, or your group chat. It opens directly in any browser.

### Option B — Using Git on your computer

```bash
git init
git add index.html README.md
git commit -m "Add Romans interactive Bible study"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Then follow **step 3** above to enable Pages.

---

## 📁 Repository Structure

```
.
├── index.html      # The complete study app (open this / serve this)
└── README.md       # This file
```

That's it — the entire app is contained in `index.html`. There is nothing to install or compile.

---

## 📱 How to Use the App

1. Open the live link (or `index.html`) in any browser.
2. **On a computer:** the chapter list is on the left. **On a phone:** tap the **☰** button (top-left) to open the chapter list.
3. Pick a chapter, then explore its five tabs.
4. To read full scripture, tap a section on the **Overview** page, or **“📖 Read Chapter (full text)”** in any chapter's **Verses** tab.
5. In the reading window: switch translation, tap **“Open in NIV on BibleGateway”**, and close with the **×**, by tapping outside, or with the **Esc** key.

---

## 👥 Suggested Small-Group Plan

**Full study — one chapter per session (16 weeks):**

1. Open with the **Key Verse** and a short prayer.
2. Read the chapter together from your own Bible.
3. Walk through the **Concepts** and **Teaching** tabs.
4. Spend most of your time on the **Discussion** questions.
5. Close with the **Reflection** prayer and application prompts.

**Condensed study — by theme (10 weeks):**

| Weeks | Chapters | Theme |
|------:|----------|-------|
| 1–2   | 1–3      | The Problem: sin |
| 3–4   | 4–5      | The Solution: justification |
| 5–6   | 6–8      | The Life: the Spirit |
| 7–8   | 9–11     | The Mystery: Israel |
| 9–10  | 12–16    | The Practice: living it out |

---

## 📖 Translations & Copyright

The full-text reading windows use **public-domain translations** that are safe to host and distribute:

- **Bible in Basic English (BBE)** — clear modern English
- **King James Version (KJV)** — the classic English text

The **NIV (New International Version)** is copyrighted by Biblica and **cannot** be stored inside the app. Instead, every reading window includes an **“Open in NIV on BibleGateway”** link that opens the official NIV passage on [BibleGateway](https://www.biblegateway.com) in a new tab.

The teaching summaries reflect mainstream historic Christian interpretation. Where Christians differ (for example on election, or women in ministry), the notes flag this so your group can discuss with grace.

---

## 🛠️ Technical Notes

- **No dependencies, no build step.** Plain HTML, CSS, and vanilla JavaScript in a single file.
- **Works offline** after the first load (an internet connection is only used for nicer web-fonts and the optional NIV/BibleGateway link).
- **iOS-friendly:** all interactions use a single attached event listener (no inline handlers), so the app works under iOS Safari privacy settings, content blockers, and Lockdown Mode.

---

## 📄 License

- The **application code** (HTML/CSS/JS) may be used and shared freely for ministry and educational purposes.
- The **embedded scripture** is public domain (BBE, KJV).
- The **NIV** is © Biblica and is **not** included — it is only linked to via BibleGateway.

---

*To God be the glory — Romans 16:27*
