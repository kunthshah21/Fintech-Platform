---
name: Relationship Manager UI
overview: "Add a showcase-only Relationship Manager flow: after three user prompts in the dashboard AI chat, reveal an \"Ask a Relationship Manager\" control near the composer; tapping it switches the page header from \"AI Assistant\" to the literal label \"RM Name\". State is coordinated between [DashboardHome.jsx](src/pages/DashboardHome.jsx) and [RoboChat.jsx](src/components/dashboard/RoboChat.jsx) with cleanup when leaving chat or resetting the thread."
todos:
  - id: dashboard-header-state
    content: Add chatHeaderLabel state, effect on isChat, pass onChatHeaderChange to RoboChat in DashboardHome.jsx
    status: completed
  - id: robochat-rm-ui
    content: "RoboChat: userPromptCount, isRmSession, RM button above composer, wire reset + onChatHeaderChange"
    status: completed
isProject: false
---

# Relationship Manager (showcase UI)

## Behavior

| Trigger | Result |
|--------|--------|
| User sends **3+** messages with `role === 'user'` (typed **or** via suggestion chips — both use the same code path in `handleSend` / `handleSuggestion`) | Show **Ask a Relationship Manager** near the input bar |
| User taps that control | Header label becomes **RM Name** (literal placeholder for a future real name) |
| User clicks **Reset** in chat (`handleReset`) | Clear RM mode and restore **AI Assistant** in the header |
| User switches to **Dashboard** (leaves chat) | Reset header to **AI Assistant** so returning to Chat does not show a stale RM title with a fresh conversation |

## Files to change

### 1. [src/pages/DashboardHome.jsx](src/pages/DashboardHome.jsx)

- Add local state, e.g. `chatHeaderLabel` initialized to `'AI Assistant'`.
- Replace the fixed `{isChat ? 'AI Assistant' : 'Dashboard'}` with `{isChat ? chatHeaderLabel : 'Dashboard'}`.
- `useEffect` depending on `isChat`: when `isChat` is false, set `chatHeaderLabel` back to `'AI Assistant'`.
- Pass two props into `RoboChat`:
  - **`onChatHeaderChange`** — `(label: string) => void` to set `chatHeaderLabel` when entering RM mode or resetting from inside the chat.
  - Optional: pass **`chatHeaderLabel`** only if you need derived UI later; not required for this showcase.

### 2. [src/components/dashboard/RoboChat.jsx](src/components/dashboard/RoboChat.jsx)

- Accept **`onChatHeaderChange`** (default no-op if undefined for safety).
- Derive **`userPromptCount`** from `messages.filter((m) => m.role === 'user').length`.
- Add **`isRmSession`** local state (boolean). When the user taps **Ask a Relationship Manager**, set `isRmSession` true and call `onChatHeaderChange('RM Name')`.
- In **`handleReset`**: set `isRmSession` false and call `onChatHeaderChange('AI Assistant')`.
- **UI — near the input bar**: Inside the bottom section (the `border-t` block that wraps the composer, [lines 159–186](src/components/dashboard/RoboChat.jsx)), add a row **above** the existing `flex` row with the text field (so it sits “near” the input without splitting the send/reset row). Show the control only when `userPromptCount >= 3 && !isRmSession`, with a short transition (optional `AnimatePresence` / `motion` to match the rest of the file).
- Styling: match existing tokens (`text-xs`/`text-sm`, `border-border`, `hover:bg-*`) and a lucide icon such as `Headset` or `UserCircle` for affordance.

## Edge cases (already covered)

- **Suggestion clicks** count as prompts — they append `role: 'user'` messages.
- **Unmount** when switching to Dashboard clears RM header via parent `useEffect`.
- No backend or WebRTC — purely UI/state for the demo.

## Optional polish (only if you want extra clarity)

- After entering RM mode, append a single **system/bot** line such as “You’re now connected with your Relationship Manager.” — **not** required for your stated “simply UI update”; skip unless you want it.
