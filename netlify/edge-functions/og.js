// Netlify Edge Function — Dynamic OG meta tags for StreamVault
// File: netlify/edge-functions/og.js

export default async function handler(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only handle /title/:id and /play/:id routes
  const titleMatch = path.match(/^\/title\/(\d+)/) || path.match(/^\/play\/(\d+)/);
  if (!titleMatch) {
    return context.next();
  }

  const tmdbId = titleMatch[1];
  const TMDB_KEY = '3001c6b89778ec27b78f6294a1e2538d';
  const IMG_BASE = 'https://image.tmdb.org/t/p/w1280';
  const IMG_POSTER = 'https://image.tmdb.org/t/p/w500';
  const SITE_URL = 'https://streamzvault.netlify.app';

  let title = 'StreamVault';
  let description = 'Watch free movies, TV shows and anime online — no sign-up needed.';
  let image = `${SITE_URL}/og-image.jpg`;
  let pageType = 'video.movie';

  try {
    // Try movie first
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=en-US`
    );
    let data = await res.json();

    if (data.success === false) {
      // Try TV show
      res = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}&language=en-US`
      );
      data = await res.json();
      pageType = 'video.tv_show';
    }

    if (data.title || data.name) {
      title = data.title || data.name;
      const year = (data.release_date || data.first_air_date || '').slice(0, 4);
      const rating = data.vote_average ? `★ ${data.vote_average.toFixed(1)}` : '';
      const genre = (data.genres || [])[0]?.name || '';

      description = [
        data.overview || '',
        [year, rating, genre].filter(Boolean).join(' · ')
      ].filter(Boolean).join(' — ');

      if (data.backdrop_path) {
        image = IMG_BASE + data.backdrop_path;
      } else if (data.poster_path) {
        image = IMG_POSTER + data.poster_path;
      }
    }
  } catch (e) {
    // fallback to defaults
  }

  // Fetch the original HTML
  const response = await context.next();
  const originalHtml = await response.text();

  // Build dynamic meta tags
  const dynamicMeta = `
    <title>${escHtml(title)} — StreamVault</title>
    <meta name="description" content="${escHtml(description.slice(0, 200))}">
    <meta property="og:type" content="${pageType}">
    <meta property="og:site_name" content="StreamVault">
    <meta property="og:title" content="${escHtml(title)} — StreamVault">
    <meta property="og:description" content="${escHtml(description.slice(0, 200))}">
    <meta property="og:url" content="${SITE_URL}/title/${tmdbId}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1280">
    <meta property="og:image:height" content="720">
    <meta property="og:image:alt" content="${escHtml(title)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escHtml(title)} — StreamVault">
    <meta name="twitter:description" content="${escHtml(description.slice(0, 200))}">
    <meta name="twitter:image" content="${image}">`;

  // Replace the existing static meta tags with dynamic ones
  const newHtml = originalHtml.replace(
    /<!-- ═══ PRIMARY SEO ═══ -->[\s\S]*?(?=<!-- ═══ OPEN GRAPH)/,
    `<!-- ═══ PRIMARY SEO ═══ -->\n    ${dynamicMeta}\n    `
  ).replace(
    /<!-- ═══ OPEN GRAPH[\s\S]*?<!-- ═══ TWITTER[\s\S]*?<meta name="twitter:image:alt"[^>]*>/,
    ''
  );

  return new Response(newHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
