# Assessment Overhaul — Implementation Plan

**Branch**: `worktree-assessment-overhaul`
**Created**: 2026-03-10

## Overview

8 tasks to overhaul the student career assessment experience — from the intro page through the assessment wizard, results display, and PDF report generation.

## Task Execution Order & Dependencies

| Task | Description | Files Modified | Dependencies |
|------|-------------|---------------|--------------|
| 1 | Remove "Jump to Question" grid | `students/assessment/page.tsx` | None |
| 2 | Rename section display names | Multiple (intro, results, PDF, i18n) | None |
| 3 | Fix student assessment intro page | `students/assessment/page.tsx` | Task 1 (same file) |
| 4 | Add mandatory cool-off timers | `students/assessment/page.tsx` | Task 1, 3 (same file) |
| 5 | Label scores as percentile | Results page + PDF report | None |
| 6 | Simplify results page language | Results page | Task 2, 5 (same file) |
| 7 | More personality trait insights | Results page + PDF + i18n | Task 6 (results page) |
| 8 | Restructure PDF — inline Malayalam | PDF report + i18n | Task 5, 7 (same files) |

**Optimal execution**: Tasks 1→3→4 (assessment page, sequential). Tasks 2, 5 can be done in parallel with assessment page work. Tasks 6→7→8 (results + PDF, sequential after 2 and 5).

## Existing Bug Assessment

- **LIVE-004 (Auth flash)**: Independent, fix AFTER these 8 tasks
- **LIVE-005 (Dashboard name)**: Independent, fix AFTER these 8 tasks

---

## Task 1: Remove "Jump to Question" Grid

**Status**: DONE
**File**: `client/src/app/students/assessment/page.tsx`

Deleted the `{/* Question Navigator */}` div block. Kept `goToQuestion` function (used by Prev/Next buttons).

---

## Task 2: Rename Assessment Section Display Names

**Status**: DONE
**Changes** (display labels only, not DB values):
- "Career Interest Inventory" / "Career Interests (RIASEC)" / "Career Interest Profile (RIASEC)" → **"Interest"**
- "Skill & Career Readiness" → **"Skill"**
- "Personality Traits" → unchanged

**Files to update**:
1. `client/src/app/students/assessment/page.tsx` — SECTION_INFO (if RIASEC/Readiness sections appear)
2. `client/src/app/assessment/results/[id]/page.tsx` — Section headers: "Career Interests (RIASEC)" → "Interest", "Skill & Career Readiness" → "Skill", "Aptitude Scores" → keep
3. `server/src/reports/student-report.ts` — PDF headers: "Career Interest Profile (RIASEC)" → "Interest", "Skill & Career Readiness" → "Skill"
4. `server/src/reports/i18n.ts` (or `i18n/en.ts`) — Translation keys

---

## Task 3: Fix Student Assessment Intro Page

**Status**: DONE
**File**: `client/src/app/students/assessment/page.tsx`
**Lines**: 332-421 (entire `if (showIntro && assessment)` block)

Replace with new content:
- Heading: "Discover Your True Career Direction"
- New descriptive subtext
- "What This Assessment Helps You Discover" — 5 checkmark items
- "Assessment Overview" — 4 session cards (Aptitude 60q, Interest 48q, Personality Traits 36q, Skill 36q)
- Estimated time note
- Important Instructions section
- Start button (keep existing logic)

Must work on both mobile and desktop.

---

## Task 4: Add Mandatory Cool-Off Timers

**Status**: DONE
**File**: `client/src/app/students/assessment/page.tsx`

**Break logic**:
- **2-minute break**: After every 10 questions within Aptitude module (between subsections)
- **5-minute break**: After each main section transition (Aptitude→Interest, Interest→Personality, Personality→Skill)
- Full-screen overlay with MM:SS countdown
- "Continue" button disabled until timer completes
- No break on backward navigation
- Track completed breaks (persist in state, don't re-trigger on resume)

**Implementation approach**:
- Add state: `completedBreaks: Set<string>`, `showBreak: { type: '2min'|'5min', key: string } | null`
- Modify `goToQuestion` to check break triggers before advancing
- Break overlay component with countdown timer

---

## Task 5: Label Scores as Percentile

**Status**: DONE
**Changes**: Display "85th percentile" instead of "85%". Labeling only — no scoring changes.

**Files**:
1. `client/src/app/assessment/results/[id]/page.tsx` — Performance gauges, stat cards
2. `server/src/reports/student-report.ts` — Score rings, bar charts

---

## Task 6: Simplify Results Page Language

**Status**: DONE
**File**: `client/src/app/assessment/results/[id]/page.tsx`

Rewrite all labels in simpler English. NO Malayalam on this page.
- "Career Interests (RIASEC)" → "What Interests You"
- "Aptitude Scores" → "Your Thinking Skills"
- "Personality Profile" → "Your Personality"
- "Top Sector Matches" → "Best Career Fields for You"
- "AI-Powered Insights" → "What Your Results Mean"
- Simplify all helper text

---

## Task 7: More Personality Trait Insights

**Status**: DONE
**Files**:
1. `client/src/app/assessment/results/[id]/page.tsx` — Expandable cards below personality gauges
2. `server/src/reports/student-report.ts` — Below trait interpretation rows (Page 3)
3. `server/src/reports/i18n/en.ts` — New keys for 6 traits × 3 levels × 3 fields (description, career connection, tips)

**6 traits**: Responsibility & Discipline, Stress Tolerance, Curiosity & Openness, Social Interaction, Team vs Independent Style, Decision-Making Style
**3 levels**: Strong, Moderate, Emerging
**3 fields each**: Description, Career Connection, Actionable Tips

---

## Task 8: Restructure PDF — Inline Malayalam

**Status**: DONE
**File**: `server/src/reports/student-report.ts`

- DELETE `MalayalamPages` component and its reference in `StudentReportDocument`
- CREATE `InlineMalayalam` component (light green bg, NotoSansMalayalam font)
- CREATE `generateInlineMl(section, data)` function for dynamic Manglish insights using actual scores
- INSERT inline Malayalam after each major English section in StudentPage1-6

---

## Change Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-03-10 | Task 1 | DONE | Removed question navigator grid from assessment page |
| 2026-03-10 | Task 2 | DONE | Renamed sections in results page, PDF, and i18n |
| 2026-03-10 | Task 3 | DONE | Complete rewrite of assessment intro page |
| 2026-03-10 | Task 4 | DONE | Added 2-min/5-min cool-off break timers with overlay |
| 2026-03-10 | Task 5 | REVERTED | Originally changed to "Xth percentile", reverted back to "X%" per user preference |
| 2026-03-10 | Task 6 | DONE | Simplified section headers and helper text on results page |
| 2026-03-10 | Task 7 | DONE | Added expandable personality trait insights (6 traits × 3 levels) on results page |
| 2026-03-10 | Task 8 | DONE | Deleted MalayalamPages, added InlineMalayalam + generateInlineMl for inline Manglish in PDF |
| 2026-03-10 | Auto-save | DONE | Added fire-and-forget POST /assessments/save-progress on every answer selection for resume support |
| 2026-03-10 | Responsive audit | DONE | Fixed 10+ responsive issues across assessment page, results page, and dashboard |
| 2026-03-10 | Codebase cleanup | DONE | Removed dead code files, unused npm packages, throwaway test files, default Next.js SVGs, duplicate image |
