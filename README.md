# BetterMarket
Marketplace for secondhand items

Installation: 

1. Clone the repository

2. Create a folder "public" to the project folder and a folder "thumbnails" inside of it.

3. Create required certification files to the root project folder:
$ openssl genrsa -out ssl-key.pem 2048
$ openssl req -new -key ssl-key.pem -out certrequest.csr
$ openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem

4. Install required dependencies
$ npm i 

5. Run the app
$ node app

6. Open localhost:3000/ in the browser once and accept the https redirection. After this
the app works
