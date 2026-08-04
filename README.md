# SmartCV — AI-Powered Resume Generator

A production-ready web application that automatically designs CV/resume layouts based on the user's content. Built with Next.js 14, TypeScript, Tailwind CSS, and `@react-pdf/renderer`.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your CV.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF Generation:** @react-pdf/renderer (client-side)
- **State Management:** Zustand
- **Payments:** Chapa (Ethiopian payment gateway)
- **Hosting Target:** Vercel free tier ($0/month)

## How It Works

### Smart Layout Engine (`src/lib/layoutEngine.ts`)

The layout engine analyzes user content and makes intelligent layout decisions:

1. **Content Analyzer** — Computes:
   - `experienceYears` (total years across work history)
   - `careerStage`: "entry-level" (0-2 yrs), "mid-level" (2-8 yrs), "senior" (8+ yrs)
   - `contentDensity`: "light" (<800 chars), "medium" (800-2000), "heavy" (>2000)
   - `hasLongSkillsList`: boolean (skills > 8)

2. **Layout Decision** — Returns:
   - `sectionOrder`: entry-level → Education/Skills first; senior → Experience first
   - `columnLayout`: light → sidebar; heavy → single column
   - `fontScale`: heavy content → smaller font; light → larger font
   - `skillsDisplay`: long lists → tags; short → bars
   - `sectionEmphasis`: which section gets visual emphasis

3. **Design Themes** — 5 free + 3 premium visual themes (accent color, fonts, heading style)

### Extending the Layout Engine

To add new rules:

```typescript
// src/lib/layoutEngine.ts
// Add new career stages in getSectionOrder():
function getSectionOrder(careerStage: CareerStage): string[] {
  switch (careerStage) {
    case "entry-level": ...
    case "mid-level": ...
    case "senior": ...
    case "executive": // new stage
      return ["personal", "experience", "certifications", ...];
  }
}
```

Adjust density thresholds in `analyzeContent()`:

```typescript
if (totalCharCount < 800) {         // Adjust these thresholds
  contentDensity = "light";
} else if (totalCharCount < 2000) {
  contentDensity = "medium";
}
```

## Chapa Payment Integration

### Setup

1. Create an account at [https://dashboard.chapa.co](https://dashboard.chapa.co)
2. Get your test mode secret key
3. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Add your key:

```
CHAPA_SECRET_KEY=CHASECK_TEST_your_key_here
```

### How It Works

- `/api/checkout` — Initiates a Chapa payment session
- `/api/checkout/callback` — Webhook that verifies payment success
- Free tier: watermarked PDF, 1-page limit
- Premium: watermark removed, unlimited pages, 3 bonus themes

### Production Deployment

1. Switch from test to live keys in `.env.local`
2. Set the same environment variables in Vercel dashboard
3. Update `callback_url` in the checkout route to your production domain

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

- `CHAPA_SECRET_KEY` — Your Chapa secret key

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── build/
│   │   ├── page.tsx          # Multi-step form + live preview
│   │   └── theme/
│   │       └── page.tsx      # Theme selection
│   ├── export/
│   │   └── page.tsx          # Final preview + PDF download + upsell
│   └── api/
│       └── checkout/
│           ├── route.ts      # Chapa payment initiation
│           └── callback/
│               └── route.ts  # Payment verification webhook
├── components/
│   ├── form/                 # Multi-step form components
│   └── pdf/                  # PDF document + live preview
├── lib/
│   ├── layoutEngine.ts       # Smart layout rules engine
│   ├── themes.ts             # Theme definitions
│   └── store.ts              # Zustand state management
└── types/
    └── index.ts              # TypeScript interfaces
```

## Features

- **Smart Layout Engine** — Rules-based, not template-fill; adapts to content
- **5 Free Themes** — Minimal, Modern Sidebar, Classic Professional, Bold Header, Compact ATS-Safe
- **3 Premium Themes** — Elegant Gold, Tech Green, Creative Purple
- **Live Preview** — Real-time CV preview as you type
- **PDF Export** — Client-side generation, no server cost
- **Chapa Integration** — Ethiopian payment gateway for premium unlock
- **Mobile Responsive** — Form works on mobile devices
- **Auto-save** — Drafts saved to localStorage
- **Bilingual Ready** — Text fields support Amharic/English toggle

## Limitations (v1)

- **Amharic PDF text:** Default Helvetica font doesn't include Ge'ez script glyphs. For full Amharic support, embed "Noto Sans Ethiopic" font via `@react-pdf/font`. See comment in `src/components/pdf/CVDocument.tsx`.
- **No user accounts** — Premium flag stored in localStorage. Add Supabase for cross-device sync.
- **Single-page free tier** — Page limit enforced in UI, not PDF renderer.

## License

MIT
