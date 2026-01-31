export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    // 1. Redirect apex → www (permanent 301)
    if (hostname === 'abdullateefoniresume.online') {
      url.hostname = 'www.abdullateefoniresume.online';
      return Response.redirect(url.toString(), 301);
    }

    // 2. Only handle www domain
    if (hostname !== 'www.abdullateefoniresume.online') {
      return new Response('Invalid hostname', { status: 400 });
    }

    // Your Azure static website endpoint
    const AZURE_ENDPOINT = 'https://abdullateefoni346088.z35.web.core.windows.net';

    // Build target URL
    let targetPath = url.pathname;
    let targetUrl;

    // Detect static assets (more robust detection)
    const isAsset =
      targetPath.startsWith('/assets/') ||
      /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2|woff|ttf|eot|json|txt)$/.test(targetPath);

    if (isAsset) {
      targetUrl = `${AZURE_ENDPOINT}${targetPath}${url.search}`;
    } else {
      // SPA: serve index.html for all other paths
      targetUrl = `${AZURE_ENDPOINT}/index.html`;
    }

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        redirect: 'manual'
      });

      // Clone response so we can modify headers
      const newResponse = new Response(response.body, response);

      // Custom headers
      const headers = newResponse.headers;

      if (targetUrl.endsWith('/index.html')) {
        // No cache on index.html (SPA needs fresh version)
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        headers.set('Content-Type', 'text/html; charset=utf-8');
      } else {
        // Long cache for static assets
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }

      // Security headers (good practice)
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return newResponse;
    } catch (err) {
      return new Response(`Error fetching from Azure: ${err.message}`, {
        status: 502
      });
    }
  }
};