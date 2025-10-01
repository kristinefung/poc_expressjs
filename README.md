# Express.js with TypeScript POC

Express.js + TypeScript API using Prisma (MySQL), Zod validation, and dependency injection via typedi.

## Features

- Express.js with TypeScript
- Prisma ORM (MySQL)
- Zod request validation (DTO pattern)
- typedi for dependency injection
- RESTful API Design

## Prerequisites

- Node.js >= 18
- MySQL instance

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/kristinefung/poc_expressjs
cd poc_expressjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database credentials and other configuration.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── controller/       # HTTP handlers
├── dto/              # Zod schemas + DTO classes
├── repository/       # Data access layer
├── router/           # Route definitions
├── service/          # Business logic layer
├── utils/            # The utility functions
prisma/
  schema.prisma       # Prisma models
```

## License

MIT
