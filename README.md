# Timebridge

> Meet across time zones—not across sleep.

Timebridge is a responsive global meeting planner for comparing live clocks and finding practical offshore meeting hours. It uses real IANA time zones, so conversions automatically account for daylight-saving changes on the selected meeting date.

## Features

- Two live, independently selectable world clocks
- Date- and daylight-saving-aware meeting conversion
- Working-hours overlap guidance
- Presets for India, the United States, the UK, Europe, Dubai, Singapore, Tokyo, and Sydney
- Responsive keyboard- and touch-friendly interface
- Cloudflare Worker-compatible production output

## Requirements

- [Node.js](https://nodejs.org/) 22.13 or newer (Node 24 LTS recommended)
- npm 10 or newer
- Git, if you want to contribute

## Run locally on Windows

Open the project folder in VS Code, then run in PowerShell:

```powershell
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
npm.cmd install
npm.cmd run dev
```

Open the `Local` URL printed in the terminal, normally `http://localhost:5173`.

## Run locally on macOS or Linux

```bash
npm install
npm run dev
```

## Environment configuration

Timebridge does not currently require secrets or runtime environment variables. An `.env.example` file is included as the safe template for future configuration. Never commit `.env` or `.env.local`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check code quality |
| `npm run typecheck` | Validate TypeScript types |
| `npm run build` | Create the production build |
| `npm test` | Run type checking and the production build |
| `npm run start` | Run the built application locally |

## How it works

The interface stores each location as an IANA time-zone identifier such as `Asia/Kolkata` or `America/New_York`. `Intl.DateTimeFormat` calculates the correct UTC offset for the chosen date, including transitions between EST and EDT. A small iterative conversion function maps the wall-clock time entered in either selected zone to a single instant, which is then formatted for both locations.

The overlap indicator treats 8:00 AM–10:00 PM as acceptable for the home location and 8:00 AM–6:00 PM as standard working hours for the offshore location.

## Project structure

```text
app/
  globals.css       Visual system and responsive layout
  layout.tsx        Page metadata and root HTML shell
  page.tsx          Live clocks and meeting planner
build/
  sites-vite-plugin.ts  Production packaging helper
public/             Static assets
worker/
  index.ts          Cloudflare Worker entry point
.github/workflows/  Automated validation
```

## Production validation

Before releasing a change, run:

```powershell
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

GitHub Actions runs the same validation for every pull request and push to `main`.

## Deployment

The project builds to Cloudflare Worker-compatible output through Vinext and includes Sites hosting metadata. Run `npm run build` first; the generated `dist/` directory is intentionally excluded from Git.

## Future enhancements

Possible later improvements include custom working-hour preferences, shareable meeting links, calendar integration, saved timezone pairs, and an optional custom domain. The current release intentionally stays lightweight and uses no database or paid service.

## License

No license has been selected. All rights are reserved by the repository owner.
