# APLICACION-WEB-SPA-NEXTJS

# Setup Requirements

Before starting, ensure you have the following installed locally:
- Node.js ≥ 18.x
- Latest version of npm, yarn, pnpm, bun, or any other package manager of your choice.

# How to run locally

To run the server, open the terminal and type in:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open  [http://localhost:3000](http://localhost:3000) (or one of the other indicated links) with your browser.

# Project Structure

```
├── app/                # App Router pages, layouts, and routes
|    └── components/    # Reusable UI components
├── lib/	           	# Utility functions and modules
├── docs/				# documentation files
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── README.md
```

# Commands and scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start the local development server         |
| `npm run build`  | Build the application for production       |
| `npm start`      | Start the production server                |
| `npm run lint`   | Run ESLint to check for code issues        |

# Use cases

## First time login

1. Open localhost:3000 on your web browser
2. Switch to registration mode
3. Register with a new mail and password
4. Open personal mail box and validate password
5. Go back to localhost:3000
6. Login with newly registered credentials.

## Adding animes to the collection

1. Login into the page
2. Go to search
3. Search for an anime (e.g. "Gundam")
4. Click on "Add to Collection" to add the anime to your personal collection

# Postman setup

This project includes several Postman collections to help test the API easily:
- My Anime Log API.postman_collection.json
- Supabase Auth API.postman_collection.json
- Jikan API.postman_collection.json

## Importing the Collections

1. Open Postman
2. Click Import → Upload Files
3. Select all three .postman_collection.json files

## Creating a Postman environment with the token

App requests require authentication token (obtained through the supabase auth API) to be stored in an environment.

Go to Environments → Add New Environment

## Authentication Flow

1. Go to Supabase Auth API → Log in
2. Run the request
3. If succesful, Postman will store the token in the environment
4. Now the protected endpoints in My Anime Log API are available to be used

## Using the Jikan API Collection

1. Set a search_query (e.g. Bleach)
2. Run the request

# Docker

This project can be fully executed inside a Docker container.

## Building the docker image

```
docker build -t my-anime-log .
```

## Running the container

```
docker run -p 3000:3000 my-anime-log
```

# Resources & Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Jikan Documentation](https://docs.api.jikan.moe/)