The following are commands used to set up the development environment.

First start the docker container by using
$ docker-compose up

To start the server run 
$ npm start

The frontend is started the same way
$ cd client
$ npm start

To view the database tables do
$ npx prisma studio

To migrate/edit the database structure you will need to do the following
$ npx prisma generate 
$ npx prisma migrate save --name <anything>
$ npx prisma migrate up
