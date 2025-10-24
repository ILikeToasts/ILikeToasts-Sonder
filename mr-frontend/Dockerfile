FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY tsconfig*.json ./
COPY vite.config.* ./
COPY .npmrc* ./

# Install dependencies
RUN npm ci --omit=dev
RUN npm install

# Copy the source code
COPY . .

# Copy the production env file
COPY .env.production .env

# Build the frontend (Vite will pick up .env)
RUN npm run build

# ---- Nginx stage ----
FROM nginx:1.25-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
