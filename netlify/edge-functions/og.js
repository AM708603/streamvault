// Netlify Edge Function — Dynamic SEO for StreamVault (Fixed)
export default async function handler(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;

  const match = path.match(/^\/(title|play)\/(\d+)/);
  if (!match) return context.next();

  const tmdbId = match[2];
  const TMDB_KEY = "3001c6b89778ec27b78f6294a1e2538d";
  const IMG_POSTER = "https://image.tmdb.org/t/p/w780";
  const IMG_BASE = "https://image.tmdb.org/t/p/w1280";
  const SITE_URL = "https://streamzvault.netlify.app";

  let title = "StreamVault";
  let description = "Watch free movies, TV shows and anime online — no sign-up needed.";
  let image = `${SITE_URL}/og-image.jpg`;
  let pageType = "video.movie";
  let year = "";
  let rating = "";
  let genres = [];
  let overview = "";
  let isTV = false;

  try {
    let res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=en-US`);
    let data = await res.json();

    if (data.success === false || !data.title) {
      res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}&language=en-US`);
      data = await res.json();
      isTV = true;
      pageType = "video.tv_show";
    }

    if (data.title || data.name) {
      title = data.title || data.name;
      year = (data.release_date || data.first_air_date || "").slice(0, 4);
      rating = data.vote_average ? data.vote_average.toFixed(1) : "";
      genres = (data.genres || []).map(g => g.name);
      overview = data.overview || "";

      description = [
        overview.slice(0, 150),
        [year, rating ? `★ ${rating}` : "", genres[0] || ""].filter(Boolean).join(" · ")
      ].filter(Boolean).join(" — ");

      if (data.poster_path) image = IMG_POSTER + data.poster_path;
      else if (data.backdrop_path) image = IMG_BASE + data.backdrop_path;
    }
  } catch (e) {}

  const response = await context.next();
  let html = await response.text();

  // 1. Remove ALL old Open Graph and Twitter tags
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "");
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");

  // 2. Update <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${esc(title)}${year ? ` (${year})` : ""} — StreamVault</title>`
  );

  // 3. Update description
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${esc(description.slice(0, 160))}">`
  );

  // 4. Inject clean new tags
  const newTags = `
    <link rel="canonical" href="${SITE_URL}/title/${tmdbId}">
    <meta property="og:type" content="${pageType}">
    <meta property="og:site_name" content="StreamVault">
    <meta property="og:title" content="${esc(title)} — StreamVault">
    <meta property="og:description" content="${esc(description.slice(0, 160))}">
    <meta property="og:url" content="${SITE_URL}/title/${tmdbId}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="780">
    <meta property="og:image:height" content="1170">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)} — StreamVault">
    <meta name="twitter:description" content="${esc(description.slice(0, 160))}">
    <meta name="twitter:image" content="${image}">
  `;

  html = html.replace(/<head[^>]*>/i, m => `${m}\n${newTags}`);

  // 5. SEO content for Google
  const seoContent = `
    <div id="seo-content" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
      <h1>${esc(title)}${year ? ` (${year})` : ""}</h1>
      <p>${esc(overview || description)}</p>
      ${rating ? `<p>Rating: ${rating}/10</p>` : ""}
      ${genres.length ? `<p>Genres: ${genres.map(esc).join(", ")}</p>` : ""}
      <img src="${image}" alt="${esc(title)}">
      <p>Watch ${esc(title)} online free on StreamVault.</p>
    </div>
  `;
  html = html.replace(/<body[^>]*>/i, m => `${m}\n${seoContent}`);

  // 6. Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": isTV ? "TVSeries" : "Movie",
    name: title,
    description: overview || description,
    image: image,
    url: `${SITE_URL}/title/${tmdbId}`,
    ...(year && { datePublished: year }),
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        bestRating: "10",
        ratingCount: "100"
      }
    }),
    genre: genres
  };

  html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=1800, stale-while-revalidate=86400"
    }
  });
}

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
