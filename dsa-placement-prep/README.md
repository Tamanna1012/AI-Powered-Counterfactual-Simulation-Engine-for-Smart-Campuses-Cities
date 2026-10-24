# DSA Placement Prep: 10-Week Plan (Python, Beginner start, 5+ h/day)

**Your inputs:** Python · Beginner · 5+ hours/day · placement drives in 1–3 months.
**Files here:**
- `DSA_Progress_Tracker.xlsx`: tracker, dashboard, verification log, mock log, weekly review, and the full 179-problem list.
- `problems.py` / `build_tracker.py`: source of the list and workbook (edit and re-run to regenerate).

> **Verify before you trust.** Titles and links follow each platform's standard URL pattern (`leetcode.com/problems/<slug>/`, `hackerrank.com/challenges/<slug>/problem`). I could not open the sites from my environment, so I have **not** confirmed every link. Open each link the first time you use it. If one 404s, search the title on the platform and fix the URL in the tracker. HackerRank challenge titles and slugs occasionally change. Premium-only LeetCode problems were deliberately left out.

---

## 1. Reality check

- 10 weeks at your level is enough to learn the core interview patterns. It is **not** enough to master everything. The goal is "solid on Easy/Medium patterns, can reason about Hard".
- Realistic pace: **~3 new problems/day, 6 days/week ≈ 18/week**, plus revision. The list has 179 problems: 84 Essential, 67 Recommended, 28 Optional. **If you are behind, do Essential only and skip Optional.** Essential-only is a fully valid plan.
- A problem counts as *yours* only if you can re-solve it cold a week later. Quality beats count.
- With a 1–3 month timeline, start on **Day 1**. Do HackerRank *Problem Solving (Basic)* in Week 3–4 (and again in Week 10) because many companies use HackerRank-style assessments.

## 2. Daily structure (5–6 h)

| Block | Time | What |
|---|---|---|
| Learn | 60 min | One concept: read GfG article or watch a short video, then hand-write 2 tiny examples. No coding yet. |
| New problems | 3 h | 2–4 new problems with the method in §5. Hard timebox: 30 min Easy, 45 min Medium, then use the hint ladder. |
| Revision | 45 min | Re-solve cold the problems the tracker marks as due (3 / 7 / 21 / 45 days after solving). |
| Log + notes | 15 min | Fill the tracker row: status, complexity, key lesson. |

- **Day 7 each week:** 2 h mock + 1 h weekly review + light revision. No new topic.
- Python you must know by end of Week 1: lists, slicing, dict, set, `collections.Counter/defaultdict/deque`, `heapq`, `sorted(key=)`, `bisect`, tuples, string methods, `enumerate/zip`, recursion limit.

## 3. Roadmap (foundation → advanced)

| Week | Topics | Prerequisite check before starting | New problems (cumulative) |
|---|---|---|---|
| 1 | Python fundamentals, Big-O; arrays & strings | None | 26 (26) |
| 2 | Hashing & frequency counting; two pointers | Arrays/strings done | 22 (48) |
| 3 | Sliding window; sorting & binary search | Two pointers, hashing | 19 (67) |
| 4 | Prefix sums/math/matrices; bit manipulation; recursion & backtracking | Binary search, arrays | 22 (89) |
| 5 | Linked lists; stacks & queues | Recursion | 22 (111) |
| 6 | Trees & BSTs | Recursion, queues | 18 (129) |
| 7 | Heaps; greedy & intervals | Trees, sorting | 14 (143) |
| 8 | Graphs: BFS, DFS, topological sort, Dijkstra | Trees, queues, hashing | 16 (159) |
| 9 | Dynamic programming (1-D, grid, strings, knapsack) | Recursion, hashing | 17 (176) |
| 10 | Tries; mixed timed sets, mocks, weak-area repair | All of the above | 3 + mixed (179) |

**Skip rule:** Do not start a week until you can solve 3 of the last week's Essential problems cold in the time limit. If you can't, repeat that week's weakest topic for 2 days. Week 9 (DP) is compressed: DP is learned best by returning to it, so keep 2–3 DP revision problems per day in Week 10.
**Bit manipulation, math, matrices, intervals, and design (LRU Cache, Min Stack, Trie)** are included because they recur in fresher interviews.

## 4. Problem list

The full list with links, difficulty, concept, prerequisites, and Essential/Recommended/Optional flags is in the **Problem list** sheet and the **Tracker** sheet (one row per problem, in recommended order). Difficulty mix: 75 Easy, 94 Medium, 10 Hard. Hard problems are Optional or Recommended and are for Weeks 8–10 only.

**Your first set (Days 1–3).** Do these in order:

| Day | Problems |
|---|---|
| 1 | HackerRank: Solve Me First → Simple Array Sum → Compare the Triplets. Goal: learn the submit workflow and Python input handling. |
| 2 | HackerRank: A Very Big Sum, Diagonal Difference, Plus Minus, Staircase. LeetCode: FizzBuzz. |
| 3 | HackerRank: Mini-Max Sum. LeetCode: Running Sum of 1d Array, Contains Duplicate, Best Time to Buy and Sell Stock. |

Day 1 learning block: time complexity. Count the loops, understand O(1), O(log n), O(n), O(n log n), O(n²), and why constants are dropped.

## 5. Per-problem method (follow every time)

1. Read the statement and constraints. Constraints hint at the target complexity (n ≤ 10⁵ ⇒ roughly O(n log n) or better).
2. Hand-trace a small example on paper.
3. Write the brute force in words.
4. State its time/space complexity.
5. Find the bottleneck and improve it (hash map? sort? pointers? stack?).
6. Code it in Python.
7. Test edge cases: empty input, one element, duplicates, negatives, max size.
8. Submit.
9. Log the result and **one lesson** in the tracker.
10. Re-solve it cold at the revision date.

**Hint ladder when asking me for help.** I will go one rung at a time and only go further if you ask:
1. Nudge (what to notice) → 2. Stronger hint (data structure/pattern) → 3. Approach in plain words → 4. Pseudocode → 5. Full Python code.

Mark honestly in the tracker: *Solved independently* (no help), *Solved with hints*, *Solved after viewing solution* (re-solve cold in 2 days before you trust it).

## 6. Milestones

These are checkpoints, not deadlines. They assume ~18 new + ~7 revision problems/week.

| Milestone | Topics covered | Difficulty mix (of new) | New / revision | Cold-solve check | Move on when… |
|---|---|---|---|---|---|
| **25** | Python basics, Big-O, arrays/strings (≈ end of Week 1) | 90% Easy, 10% Medium | 25 new / ~5 revision | Re-solve 5 random earlier Easy in ≤20 min each | ≥60% solved independently; you can state complexity for each. |
| **50** | + hashing, two pointers (≈ end of Week 2) | 60% Easy, 40% Medium | 25 new / ~15 revision | Re-solve 5 problems from Week 1, 3 from Week 2 | ≥50% of Mediums solved with at most one hint. |
| **100** | + sliding window, binary search, sorting, math, bits, backtracking, linked lists (≈ mid Week 5) | 45% Easy, 55% Medium | 50 new / ~40 revision | A 90-min set of 3 mixed Mediums from topics 2–6 | Pass ≥2 of 3 in the time limit. Otherwise repeat the weakest topic. |
| **150** | + stacks/queues, trees/BST, heaps, greedy, graphs begun (≈ Week 8) | 35% Easy, 60% Medium, 5% Hard | 50 new / ~60 revision | Two timed 90-min mocks, 2–3 problems each | Average ≥2 problems solved per mock; ≥60% independent overall. |
| **200** | + graphs, DP, tries, mixed (≈ Week 10 onward; the list stops at 179, so use the extension below) | 25% Easy, 65% Medium, 10% Hard | 50 new / ~80 revision | Full mock OA (see §7) | You can solve an unseen Medium in ~30 min about 60% of the time. |
| **Beyond 200** | Weak-topic repair, LeetCode *Top Interview 150* (the official study plan) problems you haven't done, company-tagged practice, weekly contests | Driven by your weekly review | 10–15 new/week | Weekly contest or timed set | Only continue if revision stays ≥40% of your time. |

If you cannot hit these in 10 weeks, that is normal for a beginner. Adjust the **calendar**, never the independence standard.

## 7. Weekly schedule, revision, mocks, weak areas

**Weekly rhythm (Mon–Sat new learning, Sun review):** Mon–Fri: topic block of the week. Sat: 3 mixed problems from previous weeks (no topic hints) + 1 new. Sun: mock + review.

**Revision schedule (built into the tracker):** after solving, revisit at +3, +7, +21, +45 days. Overdue rows turn red in the Tracker; the Dashboard shows the overdue count. Revise Hard-for-you problems first.

**Mock coding assessments**
- *Week 3:* 60 min, 2 problems (Easy + Medium) from solved topics.
- *Weeks 5, 7, 8, 9, 10:* 90 min, 3 problems (Easy, Medium, Medium) on HackerRank-style conditions: no autocomplete, only custom input tests.
- *Week 10:* full OA simulation at HackerRank/LeetCode mock-style: 3 problems + 20 MCQs (OS, DBMS, networks, OOP).
- Log each in the *Mock log* sheet: where time was lost, weak topics, action.
- Interview simulation: explain aloud to a friend or a recording. State the brute force first, then optimize, then complexity, then test.

**Finding weak areas.** Every Sunday, read the Dashboard *By topic* table plus the *Mock log*. Mark a topic **weak** if any of: independence < 50%, average time > 1.5× the timebox, or a failed cold re-solve. Weak topics get +30 min/day and 3 extra problems from LeetCode's topic tag at the same difficulty, before new content.

**Timed practice:** from Week 3, use a visible timer. Easy: 20–25 min. Medium: 35–45 min. After the limit, move up the hint ladder. Track "minutes per Easy/Medium" in the Weekly review sheet.

**Balance with other placement prep:** the plan uses 5–6 h/day. If you must also do aptitude, CS fundamentals, and projects, cut to ~4 h of DSA (2 new problems/day) and keep the same order and the Essential-only list. Put aptitude/CS-core in a separate 1 h block, not into your DSA slots.

## 8. Tracking progress (and keeping counts honest)

1. Use the **Tracker** sheet. One row per problem. Statuses: *Not started, Attempted, Solved independently, Solved with hints, Solved after viewing solution*.
2. **Unique counting:** the sheet counts a problem once, using the "Problem key" column (defaults to the lower-case title). If the same problem appears on two platforms, give both rows the same key; the second row is flagged `DUPLICATE KEY` and not counted again. Resubmitting the same problem never adds to your count.
3. Add your own problems in the blank rows at the bottom. Fill Title, Platform, Topic, Difficulty, Status.
4. Fill *Accepted on platform?* only when you saw "Accepted" (LeetCode) or all test cases passed (HackerRank).
5. **Monthly verification:** open each live profile, record the platform-reported count in the *Verification log*, save a screenshot or PDF, and note any gap against your tracker. Differences are normal (platform counts can include repeated types, premium, or contests) and should be noted, not hidden.
6. I can't access your platform accounts. Nothing in this workbook is verified by me; it records what you tell it. If you paste a screenshot or export from your profile, I can help reconcile it.

## 9. Building a credible coding profile

- **LeetCode:** public profile; real name or a professional handle; solve under your own account only. Recruiters glance at: total unique solved, Easy/Medium/Hard split, consistency (activity heatmap), contest rating if you take part, topic spread. Contest participation is optional but strong when consistent. A rating is a measure only if you've played several contests.
- **HackerRank:** public profile, plus **Problem Solving (Basic)** and **Python (Basic)** skill certificates (also Intermediate once you're ready). Check on the site which certifications are currently offered and what the passing rules are. A certificate has value only if you earned it by passing the platform's own test; share the verification link.
- **GitHub:** repo named like `dsa-practice` containing: your **own notes** per pattern (templates, mistakes, complexity cheatsheets), your own re-implementations of data structures (heap, trie, union-find, LRU cache), and small test utilities. Do **not** bulk-copy platform problem statements or other people's/editorial solutions; platform terms and copyright may restrict this, and a pile of copied code is easy to spot and counterproductive. Short notes with a link to the problem plus your approach are fine.
- **Assessment/achievement record:** keep a list of OAs taken, scores you were shown, contests joined, and certificates, each with a link or screenshot.
- **Platform-reported vs verified:** a number on a profile is *platform-reported*. A *verified* achievement is one a third party can confirm (certificate verification link, contest ranking page, interviewer-visible score). Describe each accurately.
- **What matters most:** being able to explain any problem on your profile. Interviewers sample from what you list.

## 10. Resume strategy

Add the section only after you have measurable results, and update it from your latest live profile.

```
Data Structures and Algorithms Practice
- Solved [N from your profile] unique coding problems on LeetCode and HackerRank, covering arrays, strings, hashing,
  binary search, trees, graphs, and dynamic programming.
- Practiced complexity analysis, algorithm design, and edge-case testing through structured problem-solving.
- LeetCode: [profile URL] | HackerRank: [profile URL]
```

Rules:
- Use the number currently shown on your profile (or, if you prefer your own count, say "unique problems" only if your tracker de-duplicates them). Never round up. Never state a rating, badge, rank, or contest placement you haven't earned. Never state proficiency labels you can't defend in an interview.
- Add a certification line only for certificates you passed: `HackerRank Problem Solving (Basic) certificate`, with the verification link.
- Keep it to 2–3 bullets. A profile link beats a long bullet when the profile is strong (consistent activity, healthy Medium count); a bullet beats a link when the profile is thin, because the bullet lets you choose the framing. If the profile is thin, lead with projects instead and keep DSA to one line.
- Fresher/full-stack roles weigh projects and fundamentals alongside DSA; do not let DSA crowd out your best project.

## 11. Weekly review (every Sunday, 30–45 min)

1. Fill one row in the *Weekly review* sheet: new, revisions, independent count, avg minutes per Easy/Medium.
2. Read the Dashboard by-topic table: find the weakest topic and the highest-value overdue revisions.
3. Decide: **advance** (≥60% independent, mock OK), **repeat** (weak topic: 2 extra days), or **add problems** (topic passes but slowly).
4. Adjust next week: move optional problems out, shift time to weak topics, set a revision list for Mon–Tue.
5. Update the *Verification log* at month end.

## 12. Ground rules

- Try for the timebox before looking at hints. Reading an editorial after zero effort teaches almost nothing.
- Write your own solution after any hint or editorial, then re-solve it two days later.
- Never submit solutions you copied. It inflates a number without building skill, and interviews expose it.
- Follow each platform's terms. Do not share contest solutions during live contests.
