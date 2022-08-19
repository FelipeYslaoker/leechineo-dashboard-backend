# Open E-Commerce Plataform Backend
> This API will being part of an open e-commerce plataform in the future.
> 
A backend made with Express in NodeJS.
## Requirements
- [NodeJS]('https://nodejs.org/en/') (v16 recommended)
- MongoDB Server
	- You can create one with [Atlas]('https://www.mongodb.com/en/cloud/atlas/').
## Initial setup
```bash
$ git clone https://github.com/FelipeYslaoker/oep-backend.git
$ cd oep-backend
```
Create a ```.env``` file with this:
```
# Mongo DB URL
DBURL=MONGODBURL
# JWT Hash
AUTH_HASH=JWT_HASH
# NodeMailer Transporter configurations
MAILER_NAME=MAILER_NAME
MAILER_HOST=MAILER_HOST
PORT_MAILER=MAILER_HOST_PORT
SECURE_MAILER=SECURE_MAILER
USER_MAILER=USER_MAILER
PASS_MAILER=MAILER_PASSWORD
```
Replace ```MONGODBURL``` with your MongoDB Url.
```bash
$ npm i
$ npm start
```
> Your server will be running on ```your-ip:3001``` or ```localhost:3001``` to change the port you'll need to change the ```appPort``` variable on ```src/index.js```.

> This API is used on https://leechineostore.web.app (developed by me, this website isn't completed yet and isn't open source.).
