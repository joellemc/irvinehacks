# Integrating Figma UI/UX with This Starter

This project is a **Next.js + Supabase + Tailwind + shadcn/ui** starter. Use this guide to plug in your Figma guidelines and `src` folder.

---

## 1. Add your Figma folders to the project

Place your exported Figma assets and guidelines inside the repo:

```
irvinehacks/
├── guidelines/          ← Figma design guidelines (tokens, typography, spacing)
│   └── (your files)
├── src/                 ← Or: public/ for images; keep components in components/
│   └── (Figma exports: images, icons, etc.)
├── app/
├── components/
└── ...
```

- **guidelines**: Design tokens (colors, spacing, radii, typography), style docs, or anything you use as the “source of truth” for the design system.
- **src**: If Figma gave you a `src` folder (e.g. from Dev Mode or a plugin), put it here. The starter already has Tailwind scanning `./src/**` in `tailwind.config.ts`, so components or styles in `src/` will be built.

If your Figma export uses a different structure, you can keep it and we’ll wire it in (see below).

---

## 2. Map Figma design tokens to CSS variables

Your app already uses **CSS variables** in `app/globals.css` for colors and radius. To match Figma:

1. **From Figma**: Get your colors (hex or RGB), spacing, border radius, and font families (e.g. from Variables, Style Guide, or Dev Mode).
2. **Convert to HSL** (optional but matches current setup): Use a tool like [hex-to-css-filter](https://www.npmjs.com/package/hex-to-hsl) or any hex→HSL converter. The format in `globals.css` is HSL **without** `hsl()`: `H S% L%` (e.g. `220 70% 50%`).
3. **Override** `app/globals.css`:

```css
/* In app/globals.css, replace or extend the :root block */
:root {
  /* Example: replace with your Figma palette */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 220 70% 50%;        /* Your Figma primary */
  --primary-foreground: 0 0% 98%;
  /* Add any new tokens, e.g. --brand-accent: 340 75% 55%; */
  --radius: 0.5rem;              /* Match Figma corner radius */
}
```

4. **Optional**: If you have a `guidelines/tokens.json` (or similar), you can add a small script or use Tailwind’s theme in `tailwind.config.ts` to read from it, or manually copy values into `globals.css` and `tailwind.config.ts` once.

---

## 3. Add Figma assets (images, icons)

- **Raster/vector images**: Put them in `public/` (e.g. `public/images/`, `public/icons/`) and reference as `/images/...` or `next/image` with `src="/images/..."`.
- **SVG icons**: Either put in `public/icons/` and use `<img>` / Next.js `Image`, or create React components in `components/icons/` that render the SVG inline (better for styling with Tailwind).

If your Figma `src` folder already has an `assets` or `icons` structure, you can move it to `public/` or `src/assets/` and import where needed.

---

## 4. Typography from Figma

If Figma specifies fonts:

1. In `app/layout.tsx`, use `next/font/google` (or local fonts) and assign a CSS variable, e.g.:

```ts
const figmaFont = Inter({ variable: "--font-figma-primary", subsets: ["latin"] });
```

2. In `globals.css`:

```css
body {
  font-family: var(--font-figma-primary), sans-serif;
}
```

3. Optionally add font sizes/weights in `tailwind.config.ts` under `theme.extend.fontSize` and `fontWeight` to match Figma type scale.

---

## 5. Use your design in components

- **Existing shadcn components** (`components/ui/*`) already use the CSS variables (e.g. `background`, `primary`, `border`). Once you update `globals.css`, they’ll follow your Figma palette.
- **New components**: Build in `components/` (or under `src/components/` if you prefer). Use Tailwind classes and semantic tokens like `bg-background`, `text-primary`, `rounded-lg` so they stay consistent with your Figma system.

---

## 6. Optional: Figma Dev Mode / design tokens

- If you use **Figma Variables** or a **design tokens** export (JSON/CSS), you can:
  - Manually copy tokens into `app/globals.css` and `tailwind.config.ts`, or
  - Add a build step that reads the tokens file and generates CSS or Tailwind config (e.g. a small Node script run before `next build`).

---

## Quick checklist

- [ ] Copy Figma **guidelines** and **src** (or assets) into the repo (`guidelines/`, `src/` or `public/`).
- [ ] Map Figma **colors** and **radius** to `app/globals.css` (`:root` and `.dark` if you use dark mode).
- [ ] Add **fonts** in `app/layout.tsx` and `globals.css` if needed.
- [ ] Put **images/icons** in `public/` or `src/assets/` and use them in pages/components.
- [ ] Build or refine **components** using Tailwind and the updated tokens.

If you share the exact structure of your Figma export (folder names and a sample of tokens/guidelines), the next step can be: “put file X in folder Y and add this exact block to `globals.css`.”
