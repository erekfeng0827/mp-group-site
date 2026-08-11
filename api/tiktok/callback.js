'use strict';

function page(title, message) {
  const safeTitle = String(title).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const safeMessage = String(message).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle}</title></head><body><main><h1>${safeTitle}</h1><p>${safeMessage}</p></main></body></html>`;
}

module.exports = function tiktokCallback(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').send(page('Method not allowed', 'Only GET requests are accepted.'));
    return;
  }

  const query = req.query || {};
  if (query.error || query.code) {
    // Do not display, log, or persist OAuth codes or provider error details.
    res.status(503).send(page(
      'TikTok authorization is not enabled yet',
      'The callback was reached, but secure server-side credential and token storage is not configured. No authorization data was stored.'
    ));
    return;
  }

  res.status(200).send(page(
    'TikTok OAuth callback ready',
    'This HTTPS callback is ready to be registered with TikTok Login Kit. Authorization remains disabled until credentials and encrypted token storage are configured.'
  ));
};
