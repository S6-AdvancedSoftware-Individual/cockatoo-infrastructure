# cockatoo-infrastructure

The repository containing K6 load tests, minikube infrastructure and an overarching docker-compose. This repository contains the following structure

```plaintext
- infrastructure (contains the minikube config files and overarching docker compose)
- tests (overarching directory for all test related things)
-- simple-web-api (a basic web-api to test K6 with)
-- load (contains load tests, organization-wide tests)
```

## Prerequisites

You need to have all [cockatoo organization repositories](https://github.com/orgs/S6-AdvancedSoftware-Individual/repositories) cloned at the same level as this directory. E.g.

- ./git/cockatoo-organization/cockatoo-gateway
- ./git/cockatoo-organization/cockatoo-frontend
- ./git/cockatoo-organization/cockatoo-accounts-service
- ./git/cockatoo-organization/cockatoo-infrastructure
- ./git/cockatoo-organization/cockatoo-post-service

## Environment secrets

### Infrastructure

Create a .env file in the [infrastructure](./infrastructure/) directory with the following secrets:

```plaintext
DB_POSTS_USERID= # the id used to authenticate database sessions.
DB_POSTS_PASSWORD=  # the password used to authenticate database sessions
DB_POSTS_SERVER= # the server where the database is hosted
DB_POSTS_PORT=5432 # default
DB_POSTS_DATABASE=postgres # default

DB_ACCOUNTS_USERID= # the id used to authenticate database sessions.
DB_ACCOUNTS_PASSWORD= # the password used to authenticate database sessions
DB_ACCOUNTS_SERVER= # the server where the database is hosted
DB_ACCOUNTS_PORT=5432 # default
DB_ACCOUNTS_DATABASE=postgres # default
```

### Tests

Run your (load) tests with the following content in order to run authenticated requests:

```plaintext
k6 run --env CLIENT_ID=your-client-id --env CLIENT_SECRET=your-client-secret --env AUDIENCE=your-audience-url --env AUTH_URL=your-auth-url load-tests.js
```

Replace `your-client-id`, `your-client-secret`, `your-audience-url`, and `your-auth-url` with the appropriate values.
