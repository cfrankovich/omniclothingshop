# omniclothingshop

## About
blah blah blah

## Development
You will need the following technologies installed.
- node (https://nodejs.org)
- docker (https://www.docker.com)

Begin by installing all node dependencies by doing the following.
```
$ npm install
$ cd client && npm install
```
Start the docker container in another terminal by using
```
$ docker-compose up
```
This will activate the container for the postgresql server.
To run the web server simply run
```
$ npm start
```
in the repository's root directory.
The client side is located in the `client/` directory. Run the react app by doing
```
$ cd client && npm start
```
To view the database tables, entries, and more in your browser do run
```
$ npx prisma studio
```
This should automatically open a new tab in your browser (make sure that the docker container is running before you do this). After you make changes to the database structure through `prisma/schema.prisma` you will have to migrate the database by running the following commands. 
```
$ npx prisma generate
$ npx prisma migrate save --name <migration name>
$ npx prisma migrate up
```
