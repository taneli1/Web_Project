# BetterMarket

Marketplace for secondhand items.




Installation: 

1. Clone the repository

2. Create a folder "public" to the project folder and a folder "thumbnails" inside of it.

3. Create a file ".env" to the project root folder and add all of these into it:

DB_HOST = **
DB_USER = **
DB_PASS = **
DB_NAME = **
NODE_ENV = development
HTTP_PORT = 3000
HTTPS_PORT = 8000
PORT = 3000


3. Create required certification files to the root project folder:
$ openssl genrsa -out ssl-key.pem 2048
$ openssl req -new -key ssl-key.pem -out certrequest.csr
$ openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem

4. Install required dependencies
$ npm i 

5. Run the app
$ node app

6. If the app does not work correctly, open localhost:3000/ in the browser once and accept the https redirection through the advanced options.
