---
name: Research-Backed Onboarding Scoring
overview: Replace the existing generic onboarding questions and simplistic scoring with the 7 research-backed questions from the Fintech Research document, implementing the 2x2 risk quadrant model (tolerance vs. capacity) with sophistication and horizon gates to determine investor profile and product recommendations.
todos:
  - id: replace-questions
    content: Replace the questions array in Onboarding.jsx with the 7 research-backed questions (sophistication, emotional risk, risk capacity, horizon, stability, goal, default tolerance) with scored options and 'why we ask' microcopy
    status: completed
  - id: scoring-model
    content: Implement computeInvestorProfile() and quadrant-based getRecommendations() in AppContext.jsx with tolerance/capacity axes, horizon gate, and sophistication gate
    status: completed
  - id: profile-screen
    content: Update the post-onboarding completion screen in Onboarding.jsx to show the investor's quadrant label and description instead of generic text
    status: completed
  - id: welcome-tour
    content: Update WelcomeTour.jsx risk labels, colors, and buildWhyText to use the 4 quadrant profiles instead of conservative/moderate/aggressive
    status: completed
isProject: false
---

# Research-Backed Onboarding Survey and Risk Quadrant Scoring

## Current State

The onboarding in [`src/pages/Onboarding.jsx`](src/pages/Onboarding.jsx) has 8 steps (name + 7 generic questions). The scoring in [`src/context/AppContext.jsx`](src/context/AppContext.jsx) only uses 3 fields (`risk`, `goal`, `horizon`) with a basic additive score to rank opportunities. Fields like `experience`, `amount`, `situation`, and `interests` are stored but never used.

## Target State

Replace with the 7 research-backed questions from the PDF, each targeting a distinct investor dimension. Implement the 2x2 risk quadrant model that places investors into one of 4 profiles, with hard gates for sophistication and liquidity horizon.

---

## 1. Replace Questions in Onboarding.jsx

Replace the `questions` array (after the `name` step) with the 7 research questions. Each question gets a `whyWeAsk` microcopy field and scored `options` with a numeric `score` value.

**New questions (keeping `name` as step 0):**

| # | ID | Title | Options (id / score) |
|---|-----|------|-----|

- **Q1 `sophistication`** - "Where does your investing stand today?" - 4 options: `fd` (S1=1), `mf-stocks` (S2=2), `p2p-tried` (S3=3), `aif-structured` (S4=4)
- **Q2 `emotionalRisk`** - "Rs 1 lakh invested. After 6 months it shows Rs 88,000. What do you do?" - 3 options: `exit` (R1=1), `hold` (R2=2), `buy-more` (R3=3)
- **Q3 `riskCapacity`** - "How much of your savings are you comfortable putting into this?" - 3 options: `less-10` (C1=1), `10-25` (C2=2), `more-25` (C3=3)
- **Q4 `horizon`** - "When might you realistically need this money back?" - 4 options: `under-3m` (L1=1), `6-12m` (L2=2), `1-3y` (L3=3), `3y-plus` (L4=4)
- **Q5 `stability`** - "What is your income situation like?" - 3 options: `salaried` (F3=3), `self-employed` (F2=2), `retired` (F1=1)
- **Q6 `goal`** - "Which of these sounds most like you?" - 4 options: `fd-beater` (G1), `cashflow` (G2), `diversify-equity` (G3), `max-yield` (G4)
- **Q7 `defaultTolerance`** - "How would you feel if one of your investments had a 2-month repayment delay?" - 3 options: `deal-breaker` (D1=1), `ok-with-explanation` (D2=2), `priced-in` (D3=3)

Each option object includes `{ id, label, description, icon, score }`.

Subtitle field becomes the "why we ask" microcopy per the research UX principles (e.g., "We ask this to match you with products you qualify for.").

Remove the old `amount` and `interests` questions entirely -- they are not part of the research model.

---

## 2. Implement Scoring Model in AppContext.jsx

Replace `getRecommendations(onboardingAnswers)` with a two-phase system:

### Phase A: Compute investor profile from answers

```javascript
function computeInvestorProfile(answers) {
  const toleranceScore = answers.emotionalRisk + answers.defaultTolerance; // Range 2-6
  const capacityScore = answers.riskCapacity + answers.stability;          // Range 2-6
  const highTolerance = toleranceScore >= 4;
  const highCapacity = capacityScore >= 4;

  let quadrant;
  if (highCapacity && !highTolerance)  quadrant = 'cautious-wealthy';   // Q1
  if (highCapacity && highTolerance)   quadrant = 'aggressive';         // Q2
  if (!highCapacity && !highTolerance) quadrant = 'anxious-explorer';   // Q3
  if (!highCapacity && highTolerance)  quadrant = 'aspirational';       // Q4

  return {
    quadrant,
    toleranceScore,
    capacityScore,
    sophisticationLevel: answers.sophistication,  // S1-S4
    horizonLevel: answers.horizon,                 // L1-L4
    goal: answers.goal,                            // G1-G4
  };
}
```

### Phase B: Filter and rank opportunities using profile + gates

```
- Horizon gate: L1 (<3 months) -> only show Invoice Discounting products
- Sophistication gate: S1-S2 -> hide Private Credit and Structured Debt
- Quadrant matching:
  - cautious-wealthy -> prefer Invoice Discounting, Structured Debt (rated)
  - aggressive -> prefer Private Credit, Revenue-Based Financing, P2P
  - anxious-explorer -> prefer P2P (low ticket), Invoice (small ticket)
  - aspirational -> prefer P2P Lending, Revenue-Based Financing
- Goal is used for ranking/copy only (not filtering)
```

Store the computed `investorProfile` (quadrant label, scores) in app state alongside `onboardingAnswers`, so the WelcomeTour and Dashboard can use it.

The answer object stored will use numeric scores: `{ sophistication: 2, emotionalRisk: 3, riskCapacity: 1, horizon: 3, stability: 3, goal: 'cashflow', defaultTolerance: 2 }`.

---

## 3. Update the Profile-Ready Screen in Onboarding.jsx

After the 7 questions, instead of the generic "Your profile is ready!" screen, show the **risk quadrant label**:

- "You are a **Cautious Wealthy** investor" (Q1)
- "You are an **Aggressive Investor**" (Q2)
- "You are an **Anxious Explorer**" (Q3)
- "You are an **Aspirational Risk-Taker**" (Q4)

Include a brief one-liner description of what this means (from the research doc's quadrant profiles table).

---

## 4. Update WelcomeTour.jsx

Update `buildWhyText` and the risk labels/colors to use the new quadrant profiles instead of the old `conservative/moderate/aggressive` labels.

**Quadrant label map:**
- `cautious-wealthy` -> "Cautious Wealthy"
- `aggressive` -> "Aggressive Investor"
- `anxious-explorer` -> "Anxious Explorer"
- `aspirational` -> "Aspirational Risk-Taker"

**Quadrant color map:**
- `cautious-wealthy` -> blue-toned (safety)
- `aggressive` -> green-toned (growth)
- `anxious-explorer` -> amber-toned (caution)
- `aspirational` -> purple-toned (aspiration)

---

## Files to Modify

- [`src/pages/Onboarding.jsx`](src/pages/Onboarding.jsx) -- Replace `questions` array, update completion screen with quadrant label
- [`src/context/AppContext.jsx`](src/context/AppContext.jsx) -- Replace `getRecommendations()` with `computeInvestorProfile()` + quadrant-based product matching; store `investorProfile` in state
- [`src/components/dashboard/WelcomeTour.jsx`](src/components/dashboard/WelcomeTour.jsx) -- Update `riskLabels`, `riskColors`, and `buildWhyText` to use quadrant profiles

---

## Scoring Summary (from research)

```
X-axis (Risk Tolerance) = Q2 score (1-3) + Q7 score (1-3)
  Range: 2-6 | >= 4 = high tolerance

Y-axis (Risk Capacity) = Q3 score (1-3) + Q5 score (1-3)
  Range: 2-6 | >= 4 = high capacity

Quadrants:
  High capacity + Low tolerance  = Cautious Wealthy  (Q1)
  High capacity + High tolerance = Aggressive         (Q2)
  Low capacity  + Low tolerance  = Anxious Explorer   (Q3)
  Low capacity  + High tolerance = Aspirational       (Q4)

Gates:
  Q4 horizon L1 (<3 months) -> Invoice Discounting only
  Q1 sophistication S1-S2   -> Hide Private Credit & Structured Debt
```
