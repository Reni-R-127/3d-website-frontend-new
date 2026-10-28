# ProJenius 3D Printing — Website Frontend

Responsive React storefront built with Vite, React Router DOM and Framer Motion. This project contains the public-facing website only; it does not include or modify an admin frontend.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Main routes

- `/` — Home
- `/shop` — Product search, category filters and sorting
- `/product/:id` — Product details, quantity selection and add-to-cart
- `/custom-printing` — Custom file printing inquiry
- `/personalized-gifts` — Personalised gift preview and inquiry
- `/bulk-orders` — Bulk and event order inquiry
- `/photo-to-3d` — Photo-to-figurine inquiry
- `/kids-creative-kits` — Toys and creative kits
- `/design-services` — Design and prototyping inquiry
- `/about`, `/contact`, `/faq`
- `/cart`, `/checkout`

## Cart and checkout

Cart items are stored in browser `localStorage`. Checkout is a frontend review form only: it does not collect payment or create an order. The UI does not claim that an order has been placed.

## Inquiry form API

Forms use `src/utils/submission.js`. Configure `VITE_API_BASE_URL` in a local `.env` file to connect to:

`POST {VITE_API_BASE_URL}/inquiries`

The endpoint should accept JSON for text-only requests and `multipart/form-data` for requests with attachments. Without the API URL, the form clearly reports that the request has not been sent; it does not show a fake success state. Do not commit secrets or private environment files.

## Contact details

The source did not contain verified company contact details. The placeholder phone number, email address and studio address have therefore been removed rather than presented as real contact information. Add verified business contact details before publishing.

## Verification notes

Relative source imports were checked for missing files. A production build still needs to be run in an environment where npm dependencies can be installed. In this workspace, `npm ci` timed out and the Vite executable was not available, so a successful build cannot be claimed here.
