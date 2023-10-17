# Node.js API Template

Starter code for quickly building RESTful APIs using Fastify and TypeScript.

## Features

- Fastify with commonly used plugins
- TypeScript
- Schema validation (JSON schema & Zod)
- Authentication middleware (JWT)
- Logging (Pino)
- Testing (Ava)
- Cluster support
- Swagger integration
- Handlebars for building UI
- ESLint with Prettier setup
- Github actions workflow setup
- Git pre-commit hooks (Husky)

## Usage

Clone the repo

```bash
git clone --depth 1 https://github.com/rohitxdev/nodejs-api-template nodejs-app
cd nodejs-app
npx rimraf ./.git
```

Install dependencies

```bash
yarn
```

Run development server

```bash
yarn dev
```
