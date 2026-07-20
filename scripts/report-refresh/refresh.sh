#!/bin/bash
# Carelu Intake Gap report — scheduled data refresh.
#
# Re-harvests the ABA cohort from prod (via the lt CLI, which holds creds),
# rebuilds src/data/intake_gap_stats.json, and if anything changed, commits and
# deploys. Runs monthly via LaunchAgent com.carelu.report-refresh.
#
# Dependencies (same as the newsletter/bot-monitor routines): this machine on,
# ~/Desktop/LeadTrap/lt with valid LEADTRAP_* creds, python3, and Vercel CLI auth.
set -euo pipefail

CARELU=/Users/yonibelson/Desktop/carelu-website
LT=/Users/yonibelson/Desktop/LeadTrap/lt
HARVEST="$CARELU/scripts/report-refresh/harvest_data"
STATS="$CARELU/src/data/intake_gap_stats.json"
TODAY=$(date +%F)
mkdir -p "$HARVEST"

echo "[$(date)] report-refresh starting"

# 1. Harvest fresh (resumes if partial; delete the jsonl for a clean pull)
rm -f "$HARVEST/aba_report.jsonl" "$HARVEST/partners.json" "$HARVEST/aba_cohort.json"
( cd "$LT" && REPORT_OUT="$HARVEST" npx tsx src/scratch_report_harvest.ts )

# 2. Rebuild stats
python3 "$CARELU/scripts/report-refresh/build_stats.py" "$HARVEST" "$STATS" "$TODAY"

# 3. Deploy only if the data actually changed
cd "$CARELU"
if git diff --quiet -- "$STATS"; then
  echo "[$(date)] no change in stats — skipping deploy"
  exit 0
fi
git add "$STATS"
git commit -q -m "Refresh Intake Gap report data ($TODAY, automated)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push origin main
vercel build --prod --yes >/dev/null 2>&1
vercel deploy --prebuilt --prod --yes >/dev/null 2>&1
echo "[$(date)] deployed refreshed report"
