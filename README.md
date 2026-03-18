# Susalabs RFID System

Enterprise Asset Management dashboard for RFID-driven operations, verification, movement tracking, maintenance, and lifecycle visibility.

## Highlights

- Premium enterprise UI with collapsible command sidebar
- Dashboard with charts, alerts, and live activity feed
- Asset registry with filters, detail views, edit flows, and identity surfaces
- Department transfer workflow and custody tracking
- Asset in/out logs, movement chronology, maintenance, lifecycle, and security modules
- Passive device monitoring for RFID tags, beacons, hooters, QR, and barcode identity
- React Router SPA with responsive layouts and Netlify-ready routing

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- React Hot Toast
- QRCode React

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production Build

```bash
npm run build
```

## Netlify

This project includes [netlify.toml](/C:/Projects/RFID%20CRM/netlify.toml) so Netlify can build and publish it with:

- Build command: `npm run build`
- Publish directory: `dist`

SPA routing is handled through a redirect rule so nested React Router routes continue to work on refresh.

## Project Structure

```text
src/
  assets/        Brand assets and favicon source
  components/    Shared shell, tables, modal, timeline, badges
  data/          Sample enterprise data
  lib/           Formatters and helpers
  pages/         Route-level modules
```

## Status Colors

- Green: Active / Verified
- Yellow: Maintenance / Pending
- Red: Repair / Alert / Flagged
- Blue: Checked Out / In Transit
- Gray: Retired / Neutral

## Continuous Deployment

Once this repo is linked to Netlify, every push to `main` can trigger an automatic production deploy.

## License

Internal project use unless you choose to publish under a separate license.
