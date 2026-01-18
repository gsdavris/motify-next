# Caching Strategy Plan (WordPress + Next.js App Router)

Στόχος: πολύ γρήγορο TTFB/SSR με δεδομένα από WP GraphQL, σε Node VPS (nginx + pm2),
με σπάνιες αλλαγές περιεχομένου και on-demand ενημέρωση μέσω webhook.

## 1) Inventory queries και σελίδων
Καταγράψτε όλα τα WP data entry σημεία και τις χρήσεις τους.

**Queries (WordPress)**
- `apollo/queries/layout/*`: menus, company info, default metadata.
- `apollo/queries/pages/*`: home, blog page, page content, metadata.
- `apollo/queries/posts/*`: posts, categories.
- `apollo/queries/projects/*`: single project.
- `apollo/queries/sitemap/*`: pages, posts, categories, projects.
- `lib/wp-slug-maps.ts`: maps για locale slugs (χρησιμοποιείται σε πολλές σελίδες).
- `lib/wp-blog-service.ts`: posts + categories aggregator.

**Pages/Routes που κάνουν queries**
- `app/[locale]/layout.tsx`
- `app/[locale]/(home)/page.tsx`
- `app/[locale]/(pages)/[slug]/page.tsx`
- `app/[locale]/(pages)/news/page.tsx`
- `app/[locale]/(pages)/news/[slug]/page.tsx`
- `app/[locale]/(pages)/news/category/[category]/page.tsx`
- `app/[locale]/(pages)/projects/[slug]/page.tsx`
- `app/sitemap.xml/route.ts`

## 2) Cache tiers (τι cache-άρουμε και για πόσο)
Ορίζουμε "βαθμίδες" με base revalidate times και tags.

**Very Long (24h)**
- `getDefaultMetadata`, `getCompanyInfo`, `getMenusByLocale`
- `getHomePageSlugs`, `getBlogPageSlugs`, `getHomePageIds`, `getBlogPageIds`

**Long (6-12h)**
- `getPageBySlug`, `getPageById`, `getPageMetadataBySlug`, `getPageMetadataById`
- `getPostsByLocale`, `getCategoriesByLocale`
- `getProjectBySlug`
- `getWpSlugMaps`

**Medium (1-3h)**
- `lib/wp-blog-service.ts` (aggregations)
- `sitemap.xml` data (posts/pages/projects/categories list)

Σημείωση: αφού οι αλλαγές είναι σπάνιες, μπορούμε να δουλέψουμε με μεγάλα TTLs
και να βασιστούμε σε on-demand revalidate όταν αλλάζει το WP περιεχόμενο.

## 3) Εφαρμογή server cache σε query helpers
Χρησιμοποιούμε Next.js Data Cache (App Router):

1. Δημιουργούμε helpers που τυλίγουν τα queries με `unstable_cache`.
2. Ορίζουμε cache tags ανά domain: `wp:pages`, `wp:posts`, `wp:projects`, `wp:menus`, `wp:metadata`.
3. Επιστρέφουμε memoized data σε όλες τις σελίδες αντί για direct calls.

**Παράδειγμα pattern**
- `lib/wp-cache.ts`: helper `cacheWpQuery(fn, keyParts, { revalidate, tags })`
- Wrapper functions (π.χ. `getPostsByLocaleCached`) σε νέο αρχείο `lib/wp-queries.ts`
  που καλούν τα υπάρχοντα `getPostsByLocale`, `getCategoriesByLocale`, κλπ.

## 4) On-demand revalidation από WP
Θέλουμε τα caches να “σπάνε” όταν αλλάζει περιεχόμενο.

1. Δημιουργία route: `app/api/revalidate/route.ts`
   - Verify secret (env `WP_REVALIDATE_SECRET`).
   - Parse payload (post/page/project/category/menu).
   - Καλεί `revalidateTag()` για τα σχετικά tags.
2. Ρυθμίζουμε WP webhook (π.χ. μέσω plugin) να κάνει POST στο endpoint.
3. Αν δεν έχουμε granular payload, κάνουμε coarse revalidate ανά section:
   - αλλαγή post -> `wp:posts`, `wp:sitemap`, `wp:slugs`
   - αλλαγή project -> `wp:projects`, `wp:sitemap`, `wp:slugs`
   - αλλαγή page -> `wp:pages`, `wp:sitemap`, `wp:slugs`
   - αλλαγή menu/company info -> `wp:menus`

## 5) Nginx + pm2 ρυθμίσεις
Για VPS με pm2:

- Προτιμότερο **1 instance** ώστε η Next cache να είναι κοινή.
- Nginx: cache static assets aggressively (long cache headers).
- Ενεργοποίηση gzip/brotli (αν διαθέσιμο).
- Προαιρετικά micro-cache HTML (λίγα δευτερόλεπτα) μόνο για ανώνυμους.

## 6) Validation & Monitoring
- Προσθήκη log σε revalidation endpoint (success/failure).
- Μέτρηση TTFB πριν/μετά (π.χ. via Lighthouse).
- Δοκιμή webhook: update post στο WP -> tag invalidation -> refresh.

## 7) Επιβεβαίωση αλλαγών (Checklist)
- Όλες οι WP query calls να περνάνε από cached wrappers.
- `app/sitemap.xml/route.ts` να χρησιμοποιεί cached data.
- Ενημέρωση ENV vars: `WP_REVALIDATE_SECRET`.
- WP webhook ενεργό.

---

### Σημειώσεις για υλοποίηση
- Αυτή η στρατηγική κρατάει τα queries σας όπως είναι (Apollo + fetch),
  αλλά αξιοποιεί το Next.js Data Cache για persist cache.
- Αν θέλετε ακόμα πιο granular control, μπορούμε να περάσουμε σε `fetch` + `next: { tags, revalidate }`,
  αλλά απαιτεί αλλαγές σε πολλά queries.
