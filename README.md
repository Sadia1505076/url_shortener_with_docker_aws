## Getting Started
This is a Url Shortener built with Next.js, prisma and MySql on planetscale.

For shortening, the [Ticket Server](https://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/) approach and Base62 encoding are used. Along with the actual short url, a QR code of it is shown on the UI for user convenience.

Ongoing Work:
Make the API calls faster.

To run the project locally:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


