# REAL BI

Real BI is a tool used to connect to [HPCC](https://hpccsystems.com/) and create visualizations from the data stored in the clusters. The visualizations can be powered by the output from ROXIE queries, logical files, or custom executed ECL scripts.

---

## Installation

### Development

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. Rename the **_.env.example_** file to **_.env_** and fill in the remaining values.
3. Add cert and key files to `/nginx/certs`.
4. Update lines #22 and #23 in `/nginx/conf.d/realbi.dev.conf.template` to match cert and key file names.
5. Run `npm install`.
6. Run `docker-compose up --build -d`.
7. After all containers are started, run `docker restart realbi_api`.
   - This is done because the server starts before the database is ready to accept connections even with the api container depending on the db container.
8. Run `docker exec -it realbi_api sh`.
9. Run `npx sequelize db:migrate` to build database tables.
10. If you have any seed files in **_api/src/seeders_**, run `npx sequelize db:seed:all`.
    - At least one cluster will need to be added to the database to begin making dashboards. A sample seed file is provided in **_api/src/seeders_**.

### Production

1. Complete development installation steps #1 and #2.
2. In the **_docker-compose.yml_** file, comment out the `Dockerfile.dev` references and comment in the `Dockerfile` references.
3. In the **_.env_** file:
   - Change the `NODE_ENV` value to "production".
   - Change the database information to point to your production database.
4. Complete development installation step #3.
5. Update lines #22 and #23 in `/nginx/conf.d/realbi.conf.template` to match cert and key file names.
6. Complete development installation steps #6-#10.

---

## Notes

- This application relies on:
  - A running instance of [Auth Service](https://github.com/hpcc-systems/Auth-Service) to handle user authentication and JWT generation.
  - An HPCC cluster containing data files.
- This application uses docker-compose to simultaneously start multiple containers:
  - MySQL Database
  - Backend Node.js API Server
  - Frontend React.js Web UI
  - Nginx Proxy Web Server
