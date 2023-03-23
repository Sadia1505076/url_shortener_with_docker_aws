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
*Demo:*
![image](https://user-images.githubusercontent.com/38729047/227378428-ff2dda40-7ae1-4e9f-a090-ea9a8d5048b1.png)
![image](https://user-images.githubusercontent.com/38729047/227378535-07221a5f-30fa-40c2-a0f8-cb9ac8dea569.png)

For detailed information: visit [ZipLink - my very own URL shortener](https://sadiatasnim.notion.site/ZipLink-my-very-own-URL-shortener-8aaec689e4ed43978a6ffeb0945fd1c6)
