#!/usr/bin/env python3
"""
Build src/data/intake_gap_stats.json from a harvested ABA report jsonl.

Reads aba_report.jsonl (one {name, threads:[[iso, hasLead]], leads:[{t,c,ty,loc,a}]}
record per ABA provider) and computes: cohort totals, after-hours %, top-12 state
distribution, and per-state payer mix. Every figure is aggregate + de-identified.

Usage: python3 build_stats.py <harvest_dir> <output_json> [generated_date]
"""
import json, sys, collections, datetime

HARVEST = sys.argv[1]
OUT = sys.argv[2]
GEN = sys.argv[3] if len(sys.argv) > 3 else datetime.date.today().isoformat()

try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo('America/New_York')
except Exception:
    ET = None

ABBR = {'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming','DC':'District of Columbia'}
NAME2ABBR = {v.lower(): k for k, v in ABBR.items()}
def norm_state(v):
    v = (v or '').strip()
    if not v: return None
    u = v.upper()
    if u in ABBR: return u
    l = v.lower()
    if l in NAME2ABBR: return NAME2ABBR[l]
    for name, ab in NAME2ABBR.items():
        if name in l: return ab
    u2 = ''.join(c for c in u if c.isalpha())
    return u2 if u2 in ABBR else None

RULES = [
  ('TRICARE', False, ['tricare','military','humana military']),
  ('Medicare', False, ['medicare']),
  ('CareSource', True, ['caresource','care source']),
  ('Amerigroup', True, ['amerigroup']),
  ('Wellpoint', True, ['wellpoint']),
  ('Peach State', True, ['peach state','peachstate']),
  ('Healthy Blue', True, ['healthy blue']),
  ('TennCare', True, ['tenncare']),
  ('BlueCare (TN)', True, ['bluecare']),
  ('Buckeye', True, ['buckeye']),
  ('Molina', True, ['molina']),
  ('Mercy Care / AHCCCS', True, ['mercy care','ahcccs']),
  ('MassHealth', True, ['masshealth']),
  ('HUSKY (CT)', True, ['husky']),
  ('SoonerCare (OK)', True, ['soonercare']),
  ('Priority Partners', True, ['priority partners']),
  ('Fidelis', True, ['fidelis']),
  ('Trillium', True, ['trillium']),
  ('Vaya Health', True, ['vaya']),
  ('Alliance Health', True, ['alliance']),
  ('MHS (IN)', True, ['mhs','managed health services']),
  ('Sunshine / Ambetter', False, ['ambetter','sunshine']),
  ('Select Health', False, ['select health','selecthealth']),
  ('Kaiser', False, ['kaiser']),
  ('Humana', False, ['humana']),
  ('Aetna', False, ['aetna']),
  ('Cigna / Evernorth', False, ['cigna','evernorth']),
  ('UnitedHealthcare / Optum', False, ['unitedhealth','united health','uhc','optum','umr','united healthcare']),
  ('Anthem', False, ['anthem']),
  ('Blue Cross Blue Shield', False, ['blue cross','bcbs','blue shield','bluecross','carefirst','highmark','wellmark','regence','premera','excellus']),
  ('Medicaid (unspecified)', True, ['medicaid','medicade','medi-caid','title 19','title xix']),
]
DROP = {'other','none','no insurance','n/a','na','self pay','self-pay','unknown','private','commercial insurance','private insurance','private pay','cash','commercial'}
def canon(raw):
    s = raw.strip().lower()
    if s in DROP: return None
    for label, is_mcd, kws in RULES:
        if any(kw in s for kw in kws):
            return (label, is_mcd)
    return None

providers = threads_total = leads_total = 0
ah = hours_known = 0
state_leads = collections.Counter()
state_providers = collections.defaultdict(set)
ins_by_state = collections.defaultdict(collections.Counter)
ins_state_tot = collections.Counter()
ins_national = collections.Counter()
mcd_flag = {}

for line in open(f'{HARVEST}/aba_report.jsonl'):
    d = json.loads(line)
    providers += 1
    threads_total += len(d['threads']); leads_total += len(d['leads'])
    for t in d['threads']:
        try:
            dt = datetime.datetime.fromisoformat(t[0].replace('Z','+00:00'))
            if ET: dt = dt.astimezone(ET)
        except Exception:
            continue
        hours_known += 1
        if dt.weekday() >= 5 or dt.hour < 8 or dt.hour >= 18: ah += 1
    for l in d['leads']:
        a = l.get('a', {})
        st = norm_state(a.get('STATE'))
        if st:
            state_leads[st] += 1
            state_providers[st].add(d['partner_id'])
        ins = a.get('INSURANCE')
        if st and ins:
            c = canon(ins)
            if c:
                ins_by_state[st][c[0]] += 1; ins_state_tot[st] += 1
                ins_national[c[0]] += 1; mcd_flag[c[0]] = c[1]

leads_with_state = sum(state_leads.values())
dist = [{'st': k, 'name': ABBR[k], 'pct': round(100*v/leads_with_state, 1), 'providers': len(state_providers[k])}
        for k, v in state_leads.most_common(12)]
ins_classified = sum(ins_national.values())
ins_state_out = {}
for d0 in dist:
    st = d0['st']; tot = ins_state_tot[st]
    if tot < 40: continue
    ins_state_out[ABBR[st]] = {'total': tot, 'top': [{'payer': p, 'pct': round(100*n/tot), 'medicaid': mcd_flag[p]}
                                                       for p, n in ins_by_state[st].most_common(4)]}

out = {
  'generatedAt': GEN,
  'cohort': {'providers': providers, 'conversations': threads_total, 'leads': leads_total,
             'states': len(state_leads), 'afterHoursPct': round(100*ah/max(hours_known,1))},
  'stateDistribution': dist,
  'insuranceNational': [{'payer': p, 'pct': round(100*n/ins_classified), 'medicaid': mcd_flag[p]} for p, n in ins_national.most_common(8)],
  'insuranceClassified': ins_classified,
  'insuranceByState': ins_state_out,
}
open(OUT, 'w').write(json.dumps(out, indent=2))
print(f'wrote {OUT}: {providers} providers, {threads_total} conversations, {len(state_leads)} states, {ins_classified} insurance-classified')
