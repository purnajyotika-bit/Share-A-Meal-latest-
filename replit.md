# Share-A-Meal (FoodBridge)

A food donation app connecting food donors (restaurants, hotels, households), NGOs/receivers, and volunteers to reduce food waste.

## Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **UI**: Tailwind CSS + Radix UI (shadcn components)
- **State**: TanStack React Query
- **Backend**: Base44 platform (entities, auth, storage)
- **i18n**: Custom translation system in `lib/i18n.js`

## Running the app

```
npm run dev -- --port 5000 --host 0.0.0.0
```

The workflow **Start application** is already configured and runs this command.

## Required environment variables

The app will show a blank loading screen without these:

| Variable | Description |
|---|---|
| `VITE_BASE44_APP_ID` | Your Base44 app ID (e.g. `6a017c522945d53d0a49d427`) |
| `VITE_BASE44_APP_BASE_URL` | Your Base44 backend URL (e.g. `https://your-app.base44.app`) |

Set these in the Secrets panel (🔒) and restart the workflow.

## Supported languages

English · हिन्दी · తెలుగు · தமிழ் · Français · ગુજરાતી · অসমীয়া

Language switcher is in the top navbar. All strings are in `lib/i18n.js`.

## Key pages

| Route | Page |
|---|---|
| `/` | Home / landing |
| `/dashboard` | Donor / Receiver / Volunteer dashboard |
| `/nearby` | Map view of nearby donations |
| `/organizations` | Organizations directory (NGOs, orphanages) |
| `/leaderboard` | Impact leaderboard |
| `/fundraising` | Fundraising campaigns |
| `/analytics` | Analytics dashboard |

## User preferences

- Keep existing project structure; do not migrate or restructure unless asked.
- Translations for new text must be added to all 7 language sections in `lib/i18n.js`.
