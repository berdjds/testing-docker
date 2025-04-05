# Build stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend files
COPY . .

# Build stage
FROM node:18 AS builder

WORKDIR /app

# Copy from development stage
COPY --from=development /app ./

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose frontend port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
