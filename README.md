## SDE Backend

NestJS backend for the Fitconnect SDE challenge.

### Tech Stack

- `NestJS`
- `TypeORM`
- `PostgreSQL`
- `Docker Compose`

### Prerequisites

- `Docker`
- `Docker Compose`

### Environment Setup

This project includes a template env file at `.env.dev`.

Create a local .env file before starting the app:

```bash
cp .env.dev .env
```

Default values:

```env
SERVER_PORT=4000
DOCKER_NETWORK=sde_network
DB_HOST=sde_postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sde_db
```

### Run With Docker

From the `sde-backend` folder:

```bash
yarn install
docker compose up
```

This starts:

- the NestJS API service
- a PostgreSQL database

On container startup, the backend runs:

```bash
yarn install
yarn migration:run
yarn start:debug
```

### Local Development Commands

If you want to run commands manually inside the backend container:

```bash
yarn migration:run
yarn migration:revert
yarn migration:create src/database/migrations/YourMigrationName
yarn migration:generate src/database/migrations/YourMigrationName
```

Other useful commands:

```bash
yarn build
yarn test
yarn test:e2e
yarn lint
```

### API Access

When the service is running, the app is available at:

- `http://localhost:4000`
- Swagger UI: `http://localhost:4000/api`

### Notes

- The application uses TypeORM migrations for database setup.
- Docker Compose mounts the project directory into the container for development.


- app Structure:
i made this app with nestjs, respecting the documentation from their site, 
i started to think from end to end, what kind of database do i need? i'm not fun script databases like typeorm but they documented it very well in their site
i used the typeorm generate migration cli cause it is not prod, i wouldn't use that on prod and instead i would write it manually
so my architectural started with this,then i made the authentication pattern, also from their documentation to ensure that everything would work fast
then i tried to use 3 modules from the nest with several dto
i relied on the backend so this part is more solid than the front, even with search queries cause i usually rely on BE when i work on full stack ensuring that user has the best experience
the structure is simple, message module security and users, ensuring SOLID principle and making everything simple and clean
i also made refresh token rotation key strategy cause i love designing things and it has been a while making these stuff
the decisions: i made double validations method, for the front and for the back, i made the back more solid cause i started the assessment from the back
enhancements: i need to make the validation also more solid on the front, using forms library like formik or react hook forms cause i can make them quickly
i wrote one unit test and i used docker 

Imagine your app needs to support thousands of read requests per second.

I have worked with heavy systems that have high traffic, and I would say:
-By using a cache layer system like Redis or Memcache, you can serve part of the requests from them instead of the DB.
-I would also limit fetching. It might not be the best approach, but I would make React fetch data once, and when I update something, I don’t fetch again instead, I use global storage. For most low-data cases, this approach works fine
-Horizontal scaling: run multiple services (maybe with PM2) or use Kubernetes if you can. Set min and max pods, and also define scaling conditions to save money (for example, scale when a pod reaches 70% CPU or RAM usage)
-Master-slave systems: use databases to read from a different instance than the one you write to. You write to the primary DB, then it syncs to the read replicas.
-CDN: if you have static assets, this can definitely help. Some systems use static React apps hosted on S3 with long caching via a CDN like Cloudflare or AWS CloudFront.
-Check your DB queries. You can use EXPLAIN on your PostgreSQL queries to ensure you are not making expensive queries repeatedly. Cache static data when possible.
-Health checks
- using db sharding and partitioning if it needs, like for this message system we can partition the messages for 2020 2021 2022 and so on..
- using indexing to read easier, it might take more time on write after indexing!

-How would you scale it?
I would use a Kubernetes cluster and set min and max pods, scaling based on CPU or RAM usage. For smaller projects, I would use PM2 and run 2 or 3 instances. Let’s not forget vertical scaling it can help in many cases.

-How do you ensure minimal response time?
We ensure minimal response time at scale by optimizing database queries and finding strategies to avoid excessive DB hits, writing clean code, fetching only relevant data, avoiding unnecessary awaits, and keeping the service lightweight and up to date.

-Ensuring fault tolerance
Scale multiple service instances so if one fails, another can handle the load. Implement a load balancer with health checks—not only for traffic but also for system health. Maintain database backups and failover strategies. Use monitoring and alerting tools. If a service fails, try to return partial data instead of a bad user experience. Timeouts and auto-restart mechanisms also help.

-Monitoring
Use tools like Datadog or Sentry for monitoring—they are great. Monitor errors, total requests, and latency. If latency increases, investigate deeper into the system.

For the frontend, monitor:
LCP (how long the largest element takes to load)
CLS (layout stability)
INP (interaction latency)

You don’t necessarily need third-party services—you can also monitor things yourself using process.memoryUsage() to check array buffer sizes if you are parsing heavy data. Track heap total and heap used to ensure there are no memory leaks and that the garbage collector is working properly. Sometimes issues come from closures, event listeners not being removed, or unused global variables.