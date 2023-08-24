# OMNICLOTHING.SHOP 

## ABOUT 
This repository hosts client and server code for the website [omniclothing.shop](https://omniclothing.shop). Omniclothingshop is an online garment market based in FL. 

## DEVELOPER INFO 

### DEPENDENCIES 
Node and docker. Both can be found at nodejs.org and docker.com.

Install the node dependencies by running `npm install` in the root (the repository) directory and the `client` directory. 

### SETTING UP THE DATABASE 
After you installed docker at docker.com, simply run `docker-compose up` to start the container (development purposes for now). To create the database, run `npx prisma db push`. 

Prisma provides a frontend for us to view and interact with the database. Run `npx prisma studio` and open the link in the output.

### MANIPULATING THE DATABASE 
This project uses prisma as an ORM for postgresql. An ORM provides an abstraction layer between our database and code. To define models (tables), relationships, or anything "database structure related," edit `schema.prisma` located in the `prisma` directory. Visit prisma.io for more info. 

After you have made changes you will have to migrate the data to the new version. Simply run `prisma migrate dev` and your changes will be "saved." 

### RUNNING THE SERVER
Run `npm start` in the root directory. This is basically just an alias for `nodemon --watch 'src/**/*.ts' --exec 'npx ts-node' src/index.ts`. 

### RUNNING THE CLIENT 
Same as server except in client directory. Navigate to the `client` directory and run `npm start` which will just run a react app.
