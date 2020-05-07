[![Build Status](https://travis-ci.com/CS2102-T10/CS2102-T10.svg?branch=master)](https://travis-ci.com/CS2102-T10/CS2102-T10)

# CS2102 Project Team 30

## Description

This application is for a food delivery service (FDS).
Our application uses React.js, Node.js, Express.js and PostgreSQL.

## Running the Application

1. Ensure that you have the latest version of NodeJS from https://nodejs.org/en/
1. Ensure that you have the latest version of PostgreSQL from https://www.postgresql.org/
   1. You should also install psql, an interactive terminal for PostgreSQL
1. Download the source code.
1. Launch psql and initialize a new PostgreSQL database called ‘cs2102’ with the following configuration:
   1. Ensure that your username is ‘postgres’
   1. Ensure that your password is blank. This can be set using the guide from https://dba.stackexchange.com/a/14741/206509
      1. Set the PGPASSWORD environment variable. For details see the manual: http://www.postgresql.org/docs/current/static/libpq-envars.html
      1. Use a .pgpass file to store the password. For details see the manual: http://www.postgresql.org/docs/current/static/libpq-pgpass.html
      1. Use "trust authentication" for that specific user: http://www.postgresql.org/docs/current/static/auth-methods.html#AUTH-TRUST
      1. Use a connection URI that contains everything: http://www.postgresql.org/docs/current/static/libpq-connect.html#AEN42532
   1. Ensure that the port number is 5432. This can be changed in the postgresql.conf file located in the PostgreSQL’s data directory (e.g. PostgreSQL/12/data)
1. Import the init.sql file into the database located in the server/api directory. This can be done by the command ‘\i [file path of init.sql]’
1. Open a Terminal and execute the command ‘npm install’ in the client folder directory. This will install all the required dependencies in the local node_modules directory for the client to run.
1. Change directory to the server folder directory and execute the command ‘npm install’. This will install all the required dependencies in the local node_modules directory for the server to run.
1. At the source code’s root directory, execute ‘npm install’.
1. At the source code’s root directory, execute ‘npm run dev’ to launch the application. This will run both the server and React.js application.

# Acknowledgements

1. [Reactstrap](https://reactstrap.github.io/) - Easy to use React Bootstrap 4 components
1. [react-calendar](https://github.com/wojtekmaj/react-calendar) - Ultimate calendar for your React app
1. [SweetAlert](https://sweetalert.js.org/guides/) - SweetAlert makes popup messages easy and pretty
1. [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js
1. [react-icons](https://react-icons.github.io/react-icons/) - Include popular icons in React projects, which utilizes ES6 imports that allows you to include only the icons that the project is using.

# Project Contributors

1. [Cranston Yeo](https://github.com/CranstonYeo)

1. [Eng Xuan En](https://github.com/Exeexe93)

1. [Kenny Ho](https://github.com/khsc96)

1. [Jeremy Loh](https://github.com/JeremyLoh)
