# Where to Add Your New Figma Design Files

Your project runs **Next.js** (`npm run dev` → `next dev`). Keep using Next.js and do **not** add `vite.config.ts` if you want to keep `npm run dev` as-is.

---

## Placement map

| Your Figma export | Put it here | Notes |
|-------------------|-------------|--------|
| **Guidelines** | `guidelines/` | Replace or add files next to `.gitkeep`. |
| **Components** | `components/` (project root) | Next.js uses `@/components` from the **root** `components/` folder, not `src/app/components`. Replace or merge your new design components here. |
| **Context** | `context/` (new folder at root) or `components/providers/` | Create the folder and use the context in `app/layout.tsx` (e.g. wrap `{children}` with your providers). |
| **Pages (screens)** | `app/` routes | Next uses file-based routing. Map each screen to a route, e.g.: `app/page.tsx`, `app/review/page.tsx`, `app/results/page.tsx`. Replace the content of those files with your new page components or import from a `pages/` folder if you create one. |
| **app.tsx** | Not used as entry | Next’s entry is `app/layout.tsx` + `app/**/page.tsx`. Put shared layout/providers from `App.tsx` into `app/layout.tsx`. |
| **routes.ts** | Optional: `src/app/routes.ts` or delete | Next doesn’t use a routes file; routing is in `app/*/page.tsx`. Only keep `routes.ts` if you use React Router inside a page. |
| **imports/project-features.md** | `docs/project-features.md` or `imports/project-features.md` | Create `docs/` or `imports/` and add the file. |
| **styles/fonts.css** | `app/fonts.css` or keep `src/styles/fonts.css` | If you use `app/globals.css` only, add `@import './fonts.css';` in `app/globals.css` and put `fonts.css` in `app/`. |
| **styles/index.css** | Not used as main CSS | Next’s main global CSS is `app/globals.css`. Merge your index.css (and theme/tailwind) into `app/globals.css` or import there. |
| **styles/tailwind.css** | Merge into `app/globals.css` | Your `app/globals.css` already has `@tailwind base/components/utilities`. Add any extra Tailwind from the Figma file there. |
| **styles/theme.css** | Merge into `app/globals.css` | Copy CSS variables / theme rules into `app/globals.css` (e.g. into `:root` / `@layer base`). |
| **package.json** | **Merge**, don’t replace | Keep `next`, `react`, `react-dom`, and the `"dev": "next dev"` script. Add any new dependencies from the Figma export. |
| **postcss.config.mjs** | Keep or merge | You already have Tailwind + autoprefixer. Only add/change if the Figma setup needs different PostCSS plugins. |
| **vite.config.ts** | Do **not** add | Adding Vite would require switching from Next and changing `npm run dev`. Omit this to keep `npm run dev` as Next.js. |

---

## Summary: keep `npm run dev` working

1. **Do not add** `vite.config.ts` — the app stays on Next.js.
2. **Use root `components/`** for UI (so `@/components/...` keeps working).
3. **Use `app/` for routes and layout** — `app/layout.tsx` and `app/**/page.tsx`.
4. **Use one global CSS file** — `app/globals.css` — and merge your new styles (fonts, theme, tailwind) there.
5. **Merge** any new deps from the Figma `package.json` into your root `package.json` and run `npm install` after.

If you later want to switch to Vite instead of Next.js, you’d replace the Next setup with Vite and then use `vite.config.ts`, `src/`-based routing, and `App.tsx` as the entry.
