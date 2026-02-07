# Implementation Evaluation Guide (Execution Reality Rubric)

## Purpose

Agents must evaluate ideas based on **execution difficulty, cost, speed, and risk**.

Do NOT score inspiration, impact, or excitement here.

This phase answers ONLY:

> "How hard, slow, risky, and expensive will this be to ship and maintain?"

This rubric intentionally acts as a **counterweight** to the Excitement-First rubric.

High score = easier / faster / cheaper / safer  
Low score = hard / slow / expensive / risky

---

# Evaluation Rules

You MUST:

1. Ignore idea excitement or market size
2. Score implementation realities only
3. Assume a small team (1–3 engineers)
4. Penalise hidden complexity
5. Prefer boring, proven tech
6. Be conservative and skeptical
7. Output numeric scores only

If unsure, score LOWER not higher.

---

# Scoring System

Each category is scored 0–5.

Multiply by its weight.

Total max score = 100.

---

## 1. Build Complexity (weight ×4 → 20)

How difficult is the initial implementation?

0 = research-level / novel tech required  
1 = extremely complex architecture  
2 = many moving parts / custom systems  
3 = moderate engineering  
4 = mostly straightforward CRUD/automation  
5 = trivial / glue existing tools together

Penalise:

- distributed systems
- realtime engines
- custom protocols
- heavy infrastructure

Prefer:

- APIs
- simple services
- boring stacks

Score × 4

---

## 2. Time to MVP (weight ×4 → 20)

How fast can a small team ship first usable value?

0 = > 2 years  
1 = 18 months  
2 = 12 months  
3 = 6 months  
4 = 3 months  
5 = weeks

Fast feedback cycles reduce risk dramatically.

Score × 4

---

## 3. Cost to Build (weight ×3 → 15)

Infrastructure + tooling + staffing costs.

0 = millions / specialized hires  
1 = very expensive infrastructure  
2 = high ongoing burn  
3 = moderate SaaS/cloud costs  
4 = cheap  
5 = near-zero cost / runs locally

Prefer:

- serverless
- managed services
- minimal dependencies

Score × 3

---

## 4. Ongoing Maintenance Burden (weight ×3 → 15)

How painful is long-term upkeep?

0 = constant firefighting / 24-7 ops  
1 = heavy DevOps / reliability engineering  
2 = frequent breakage  
3 = moderate upkeep  
4 = low maintenance  
5 = mostly set-and-forget

Penalise:

- realtime infrastructure
- complex scaling
- frequent migrations
- vendor churn

Prefer:

- stateless services
- simple databases
- stable APIs

Score × 3

---

## 5. Technical Risk / Unknowns (weight ×3 → 15)

How much uncertainty or unknown feasibility?

0 = many unknowns / experimental  
1 = unclear feasibility  
2 = some unknowns  
3 = known patterns exist  
4 = proven approach  
5 = extremely standard / solved problem

Avoid:

- “we’ll figure it out”
- speculative assumptions
- untested approaches

Score × 3

---

## 6. Dependency Risk (weight ×2 → 10)

Reliance on external services/platforms.

0 = entirely dependent on one fragile API/platform  
1 = heavy lock-in  
2 = several critical dependencies  
3 = some dependencies  
4 = mostly independent  
5 = fully self-contained

Penalise:

- rate limits
- platform bans
- API volatility
- legal or policy risks

Score × 2

---

## 7. Team Fit / Skill Match (weight ×1 → 5)

Does the current team already know how to build this?

0 = requires new expertise/hiring  
1 = steep learning curve  
2 = some unfamiliar tech  
3 = mostly familiar  
4 = strong fit  
5 = exactly what the team already excels at

Execution speed is strongly affected by this.

Score × 1

---

# Final Score Formula

Total =

(build_complexity × 4) +
(time_to_mvp × 4) +
(cost × 3) +
(maintenance × 3) +
(risk × 3) +
(dependency × 2) +
(team_fit × 1)

Max = 100

---

# Required Output Format (STRICT)

Agents MUST output exactly this structure:

complexity:
time_to_mvp:
cost:
maintenance:
risk:
dependency:
team_fit:

total:

reasoning: "short, concrete explanation of biggest risks"

---

# Agent Behaviour Notes

- Prefer simple over clever
- Prefer proven over novel
- Assume hidden complexity exists
- Penalise operational burden
- Reward fast, cheap, boring solutions

---

Add your finding to EXECUTION_RANKINGS.md
