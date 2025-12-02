# My Anime Log

**My Anime Log** is a simple and intuitive web application that helps users keep track of the anime they watch.

# Online Deployment

The app is deployed through Vercel at: [my-anime-log.vercel.com](https://my-anime-log.vercel.app)

# Tech Stack

- Next.js + React
- Tailwind CSS: UI styling.
- Supabase: Database hosting and user authentication.
- Vercel: Deployment platform.
- Docker: Testing environment.
- GitHub Actions: CI/CD pipeline for automated deployment to Vercel.

# Documentation

All project documentation is stored under the `docs` directory, including:
- **Architecture diagram**: Overall system and components architecture.
- **Database diagrams**: Database schema model for Supabase.
- **Sequence diagrams**: End‑to‑end flows for several use cases.
- **Postman collections**: Ready‑to‑use collections for testing with Postman.

# How to run the project

## Setup Requirements

Before starting, ensure you have the following installed:
- Node.js ≥ 18.x
- Latest version of npm, yarn, pnpm, bun, or any other package manager of choice.
- Git to clone the repository.
- Docker (optional, required to run the app in a container).
- A Supabase account and project (the database schema is described in `docs/db`).
- Postman (optional, recommended for testing with the provided collections in `docs/postman`).

After cloning the repository, run `npm install` to download and install all necessary packages and dependencies for the project.

```bash
git clone https://github.com/avtr-inanca/APLICACION-WEB-SPA-NEXTJS.git
cd APLICACION-WEB-SPA-NEXTJS
npm install
```

## Environment Variables

Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

These values can be obtained from the Supabase Dashboard → Project Settings:
- For **NEXT_PUBLIC_SUPABASE_URL**, go to Data API → Project URL → URL
- For **NEXT_PUBLIC_SUPABASE_ANON_KEY**, go to API Keys → anon public

## Run locally without Docker

To locally run the server, open the terminal and type in:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (or one of the other indicated links) with your browser.

## Run through Docker

This project can be fully executed inside an isolated Docker container.

### Building the docker image

To create a production-ready image, run:

```bash
docker build -t my-anime-log .
```

### Running the container

To run the container, expose port 3000 to access the app in your browser:

```bash
docker run -p 3000:3000 my-anime-log
```
After the container starts, open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

# Project Structure

```
├── app/                        # Application routes, layouts, and pages
│   ├── api/                    # API routes
│   ├── styles/                 # Global and page-level styles
│   ├── components/             # Reusable UI components
│   │   ├── AuthGuardDiv.tsx    # Login validation on each page.
│   │   ├── ExpandableText.tsx  # Expandable descriptions of animes
│   │   └── header.tsx          # Header on top of each page
│   ├── contexts/               # Context providers
│   │   ├── AuthContext.tsx     # Token validation
│   │   └── LanguageContext.tsx # Language translations
│   ├── home/                   # User's home page
│   ├── search/                 # Page for searching anime
│   ├── collection/             # User's anime collection page
│   ├── panel/                  # User's personal information
│   └── page.tsx                # Landing page, Login, Registration of new users
├── docs/                       # Project documentation, diagrams.
├── lib/                        # Services and helper modules
│   ├── auth/                   # User Authentication service
│   ├── jikan/                  # Anime Searches service
│   └── supabase/               # Supabase database usage service
└── public/                     # Pubicly available assets
```

# API

The main application API is implemented using Next.js route handlers under `app/api/collection`.  
All endpoints require a valid user authenticated in Supabase.

| Route                              | Method | Description                                   |
|------------------------------------|--------|-----------------------------------------------|
| `/api/collection`                  | GET    | Retrieve the user’s anime collection          |
| `/api/collection`                  | POST   | Add a new anime entry to the collection       |
| `/api/collection/[id]`             | PUT    | Update an existing entry (e.g. watch status)  |
| `/api/collection/[id]`             | DELETE | Remove an anime entry from the collection     |

Supabase Authentication and the Jikan API are consumed directly inside the services under `lib/`.

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

# Resources & Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Jikan Documentation](https://docs.api.jikan.moe/)