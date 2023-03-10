## Getting Started
This is a Url Shortener built with Next.js, prisma and MySql on planetscale.

For shortening, the [Ticket Server](https://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/) approach and Base62 encoding are used. Along with the actual short url, a QR code of it is shown on the UI for user convenience.

Ongoing Work:
Make the API calls faster.

To run the project locally:
Create a .env file in the root folder. Add database url of your database:
```bash
DATABASE_URL='mysql://USER_NAME:PASSWORD@HOST:PORT/DB_NAME'
```
Then run:

```bash
npm install
npx prisma generate
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


