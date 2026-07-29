---
title: Cloudflare Performance
aliases: [Cloudflare CDN Performance, Argo Smart Routing, Cloudflare Images]
tags: [cloudflare, performance, cdn, caching, optimization]
domain: Cloudflare
difficulty: Intermediate
created: 2026-07-29
related: [Cloudflare_Overview, Cloudflare_Workers, Workers_Patterns]
status: complete
---

# Cloudflare Performance

> [!abstract] TL;DR
> Cloudflare's performance toolkit goes beyond basic CDN caching: Argo Smart Routing optimizes the path through Cloudflare's backbone, Polish converts images to WebP, Mirage lazy-loads images on slow connections, the Image Resizing API resizes on-the-fly, Stream handles adaptive bitrate video, and Zaraz loads third-party scripts at the edge to improve Core Web Vitals.

## Cache Everything Strategy

By default, Cloudflare only caches static file extensions (images, CSS, JS). To cache HTML and API responses, you need explicit rules.

### Cache Rules (Dashboard → Caching → Cache Rules)

```
Rule: Cache All GET /blog/*
  Condition: (http.request.method eq "GET") AND (starts_with(http.request.uri.path, "/blog/"))
  Action: Eligible for cache
  Edge TTL: 1 hour
  Browser TTL: 5 minutes
```

```
Rule: Bypass cache for authenticated users
  Condition: http.cookie contains "session="
  Action: Bypass cache
```

### `Cache-Control` Header Best Practices

```
# Immutable static assets (hashed filenames: app.a3f9b2.js)
Cache-Control: public, max-age=31536000, immutable

# HTML pages (revalidate frequently)
Cache-Control: public, max-age=0, must-revalidate

# API responses (short cache, vary by user)
Cache-Control: private, max-age=60

# Never cache
Cache-Control: no-store
```

**Edge TTL vs Browser TTL:**
- **Edge TTL:** how long Cloudflare's cache stores it (set in Cache Rules)
- **Browser TTL:** the `max-age` value sent to the user's browser
- They can differ: edge caches for 1 hour, browser caches for 5 minutes

### Custom Cache Keys

By default, cache key = full URL. Customize to cache variants:

```
# Cache by URL + Accept-Language header (for multilingual sites)
Cache key: URL + request.headers.Accept-Language

# Ignore query string (serve same cached response for ?utm_source=*)
Cache key: URL without query string
```

Configure under Caching → Cache Rules → Cache Key Fields.

---

## `cf-cache-status` Debugging

```bash
curl -I https://example.com/styles.css
# x-cache: HIT              ← served from Cloudflare cache
# cf-cache-status: HIT      ← same info
# age: 3234                 ← seconds since it was cached
# cf-ray: abc123-SFO        ← which PoP served it (SFO = San Francisco)
```

To find which PoP you're hitting: `cf-ray: {id}-{colo}` — the colo code is the IATA airport code.

---

## Argo Smart Routing

Argo optimizes the path that requests travel through Cloudflare's backbone network. Normal internet traffic hops through many ISPs unpredictably; Argo routes via Cloudflare's private backbone to find the fastest path to your origin.

```
Without Argo: User → ISP → Multiple hops → Origin (unpredictable route)
With Argo:    User → Cloudflare PoP → Cloudflare backbone → Origin PoP nearest origin
```

**Typical improvement:** 30–50ms reduction on dynamic (uncacheable) requests.  
**Cost:** $5/month base + $0.10/GB of Argo-routed traffic.  
**Enable:** Speed → Optimization → Argo → Enable.

Argo is most valuable for:
- Dynamic API responses that can't be cached
- Origins in regions with poor internet infrastructure (Southeast Asia, Africa)
- Time-sensitive requests (checkout, authentication)

---

## Image Optimization

### Polish — Automatic WebP/AVIF Conversion

Polish compresses images at the edge. Enable under Speed → Optimization → Polish:

| Mode | What it does |
|---|---|
| **Lossless** | Strip metadata (EXIF), lossless compression |
| **Lossy** | Re-encode JPEG with quality optimization |
| **WebP** | Convert JPEG/PNG to WebP (smaller, same quality) |

Polish runs on cached images — images must be cached by Cloudflare to be processed.

### Mirage — Mobile Image Optimization

Mirage detects slow connections (2G, 3G) and serves lower-resolution placeholder images first, then loads full resolution:
- Lazy-loads images below the fold
- Scales images to device size (doesn't serve 2000px wide image to mobile)
- Enable under Speed → Optimization → Mirage

### Image Resizing (`cf.image` API)

Resize images on-the-fly via URL parameters or via a Worker:

```
# Resize via URL (requires Image Resizing plan):
https://example.com/cdn-cgi/image/width=300,height=200,fit=crop/images/photo.jpg
```

```typescript
// Via Worker (more control):
async function handleImageRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const width = parseInt(url.searchParams.get('w') ?? '800');

  // Fetch from R2 and resize
  const imageURL = `https://my-bucket.example.com${url.pathname}`;

  return fetch(imageURL, {
    cf: {
      image: {
        width,
        height: Math.round(width * 0.5625),  // 16:9
        fit: 'cover',
        format: 'webp',
        quality: 85,
      },
    },
  });
}
```

**Supported options:** `width`, `height`, `fit` (contain/cover/crop/pad), `format` (webp/avif/jpeg/png), `quality`, `blur`, `sharpen`, `brightness`.

---

## Cloudflare Stream — Video Hosting

Stream is Cloudflare's video hosting service with adaptive bitrate (ABR) streaming:

```
Upload → Cloudflare processes → Multiple quality renditions → HLS/DASH adaptive stream
```

### Uploading a Video

```bash
# Direct upload (video up to 200GB)
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F file=@video.mp4 \
  "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream"

# Returns: stream.cloudflare.com/{video_id}/manifest/video.m3u8
```

### Embedding a Video

```html
<!-- Cloudflare Stream player (uses adaptive bitrate automatically) -->
<stream src="{video-id}" controls autoplay></stream>
<script data-cfasync="false" defer type="text/javascript"
  src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>

<!-- Or with iframe embed: -->
<iframe src="https://iframe.cloudflarestream.com/{video-id}" allowfullscreen></iframe>
```

**Stream advantages:**
- ABR: auto-adjusts quality based on user's bandwidth
- No server to manage (pure SaaS)
- Per-minute pricing: $5/1000 minutes stored + $1/1000 minutes delivered

---

## Zaraz — Third-Party Script Manager

Third-party scripts (Google Analytics, Facebook Pixel, Hotjar, Intercom) are loaded in the user's browser — they block rendering, cause LCP/FID regressions, and create privacy exposure.

Zaraz loads third-party tools **at the edge** (in a Cloudflare Worker), replacing client-side JS:

```
Without Zaraz: Browser loads page → Browser fetches GA script → GA runs → Analytics sent
With Zaraz:    Browser loads page → Worker runs GA logic → Analytics sent from edge
               (no client-side script, no blocking, better Core Web Vitals)
```

### Enabling Zaraz

1. Speed → Zaraz → Add Tool
2. Select the tool (Google Analytics 4, Meta Pixel, HubSpot, etc.)
3. Configure the trigger (page view, click, form submit)
4. Zaraz handles the rest — no more GA `<script>` tag in your HTML

**Privacy benefit:** user's IP and fingerprint data never reaches third parties — Zaraz masks it.

---

## Core Web Vitals Optimization Checklist

| Metric | Target | Cloudflare lever |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Cache HTML + assets, Polish for WebP, Mirage |
| **FID/INP** (Interaction to Next Paint) | < 200ms | Zaraz (removes blocking scripts), Workers for edge SSR |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Image resizing (serve correct dimensions), Mirage |
| **TTFB** (Time to First Byte) | < 800ms | Argo Smart Routing, cache HTML at edge |

### Speed Insights

Cloudflare's free Speed Insights (formerly Web Analytics) shows Core Web Vitals data from real users, broken down by page, country, and device type. Enable under Speed → Web Analytics.

---

## Common Pitfalls

- **Polish doesn't run on uncached images.** If the image is served from origin on every request (no cache), Polish has nothing to work with. Cache images first.
- **Image Resizing creates a new cache key per variant.** Resizing to width=300 and width=301 creates two cached entries. Use a limited set of predefined sizes.
- **Argo doesn't help for cached content.** Argo optimizes the path to origin — but if the response is cached at the edge, the origin path isn't taken. Argo only benefits dynamic/uncacheable traffic.
- **Zaraz changes the attribution model.** Server-side events can miss some browser signals. Test your analytics parity before fully switching.
- **Stream minutes are counted on upload, not just delivery.** Storing 1000 hours of video costs $5/month even if no one watches it.

---

## Review Questions

1. What is the difference between Edge TTL and Browser TTL in Cloudflare cache rules?
2. Your origin sends `Cache-Control: private` for all HTML responses. You want Cloudflare to cache HTML for 5 minutes anyway. How do you configure this?
3. A user on a 3G connection visits your image-heavy site. Which Cloudflare feature automatically improves their experience, and how?
4. What problem does Zaraz solve, and what are the two main benefits over loading scripts directly in the browser?
5. Your API's p99 latency is 200ms. The origin is in Frankfurt, and most users are in Asia. Argo is enabled. Explain how Argo reduces this latency.
