import { it, expect, vi } from 'vitest';
import { ScrapeBadger } from '../src/client.js';
it('refreshes live discovery after an endpoint is hidden', async () => {
  const row = { method: 'GET', path: '/v1/example/search', api: 'example', status: 'deprecated' };
  const fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ endpoints: [row] }), { headers: { "Content-Type": "application/json" } })).mockResolvedValueOnce(new Response(JSON.stringify({ endpoints: [] }), { headers: { "Content-Type": "application/json" } }));
  vi.stubGlobal('fetch', fetch);
  try {
    const client = new ScrapeBadger({ apiKey: 'test' });
    expect(await client.endpoints()).toEqual([row]);
    expect(await client.endpoints()).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(2);
  } finally { vi.unstubAllGlobals(); }
});
