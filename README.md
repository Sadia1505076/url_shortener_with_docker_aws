## Getting Started
This is a Url Shortener built with Next.js, prisma and MySql on planetscale.

*Live Demo*: [https://go.sadia.dev/](https://go.sadia.dev/)

For shortening, the [Ticket Server](https://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/) approach and Base62 encoding are used. Along with the actual short url, a QR code of it is shown on the UI for user convenience.

The [vercel-version](https://blinkify.vercel.app/) of this project is very slow. To make the API calls faster, I have deployed the containerized version of this project in AWS lightsail using docker. For ssl certification, nginx is used as a reverse proxy.

To run the project locally:

Create a .env file in the root folder. Add database url of your database:
```bash
DATABASE_URL='mysql://USER_NAME:PASSWORD@HOST:PORT/DB_NAME'
```
Create the certificate and key files and move them inside nginx/.

Then from the root folder 
run:

```bash
docker-compose up --build -d
```


