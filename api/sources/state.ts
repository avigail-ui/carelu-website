import { PAYER_CHANGELOG } from '../../src/data/payers/changelog.js';
import {
  json,
  requireConfig,
  isResponse,
  requireAuth,
  getRepoFileText,
  getLatestCommitDate,
  NEXT_REFRESH,
} from './_shared.js';
import type { RequestsFile, SourceEvent, SourceRequest } from './_shared.js';

/* ================================================================
   GET /api/sources/state  (auth required)
   Reads requests.json + events.json from the private carelu-sources
   repo and assembles a server-side heartbeat: last directory refresh
   (latest payer changelog date), last pipeline activity (newest
   event), next scheduled refresh, and the latest carelu-sources
   commit date. no-store — always live.
   ================================================================ */

export async function GET(request: Request): Promise<Response> {
  const cfg = requireConfig();
  if (isResponse(cfg)) return cfg;

  const unauthorized = requireAuth(request, cfg.secret, Date.now());
  if (unauthorized) return unauthorized;

  let requests: SourceRequest[] = [];
  let events: SourceEvent[] = [];
  let lastSourcesCommit: string | null = null;

  try {
    const [requestsText, eventsText, commitDate] = await Promise.all([
      getRepoFileText(cfg.token, 'requests.json'),
      getRepoFileText(cfg.token, 'events.json'),
      getLatestCommitDate(cfg.token).catch(() => null),
    ]);
    requests = (JSON.parse(requestsText) as RequestsFile).requests ?? [];
    events = (JSON.parse(eventsText) as SourceEvent[]) ?? [];
    lastSourcesCommit = commitDate;
  } catch (err) {
    console.error('sources/state read failed', err);
    return json({ error: 'could not read source repository' }, 502);
  }

  // Newest-first events for the history panel.
  const sortedEvents = [...events].sort((a, b) => b.ts.localeCompare(a.ts));
  const lastPipelineActivity = sortedEvents[0]?.ts ?? null;

  // Latest payer-directory refresh = newest changelog entry date.
  const lastDirectoryRefresh = PAYER_CHANGELOG.reduce(
    (latest, e) => (e.date > latest ? e.date : latest),
    PAYER_CHANGELOG[0]?.date ?? ''
  );

  const counts = {
    open: requests.filter((r) => r.status === 'open').length,
    received: requests.filter((r) => r.status === 'received').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled').length,
  };

  return json({
    requests,
    events: sortedEvents,
    heartbeat: {
      lastDirectoryRefresh: lastDirectoryRefresh || null,
      lastPipelineActivity,
      lastSourcesCommit,
      nextScheduledRefresh: NEXT_REFRESH,
      counts,
    },
  });
}
