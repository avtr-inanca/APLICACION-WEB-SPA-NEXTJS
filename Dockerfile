# Build phase: Install dependencies and compile the project
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Final phase: Execute the compiled app
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
CMD ["npm", "start"]
