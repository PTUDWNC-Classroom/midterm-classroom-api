## Instructions for creating a local MySQL database 

1. Install [MySQL Community Server 8.0.27](https://dev.mysql.com/downloads/mysql/)
   
2. Start MySQL server

3. Open **classroom-api** folder and add `.env` file. Example:

```
DEV_DB_NAME=classroomdb    // your database name
DEV_DB_HOSTNAME=127.0.0.1  // your localhost
DEV_DB_USERNAME=root       // your username in MySQL
DEV_DB_PASSWORD=           // your password in MySQL
```

then create database

```
> npx sequelize db:create
```

5. Open the MySQL command line. Run `classroomdb.sql` to create tables and import data

* If MySQL user has password

```
> mysql -u your-username -p your-database-name < path-of-classroomdb.sql
// then you need to enter the MySQL user password
```
* else
  
```
> mysql -u your-username your-database-name < path-of-classroomdb.sql
```
Your database has been created!
