# Build stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY . .

# Production stage
FROM node:18-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy backend files
COPY --from=development /app/app.js ./
COPY --from=development /app/routes ./routes

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
