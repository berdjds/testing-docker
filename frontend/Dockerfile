# Build stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy frontend files
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-slim

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose frontend port
EXPOSE 3000

# Start the server correctly for standalone mode
CMD ["node", "server.js"]
