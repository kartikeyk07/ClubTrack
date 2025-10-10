# 1️⃣ Use official Node.js LTS image
FROM node:20-alpine AS base

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first (for better build caching)
COPY package.json yarn.lock* package-lock.json* ./

# 4️⃣ Install dependencies
# Use yarn if yarn.lock exists, otherwise use npm
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --legacy-peer-deps; fi

# 5️⃣ Copy rest of the project
COPY . .

# 6️⃣ Build the Next.js app
RUN npm run build || yarn build

# 7️⃣ Use a lightweight Node image for production
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from builder
COPY --from=base /app ./

# Expose Next.js default port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the Next.js app
CMD ["npm", "start"]
