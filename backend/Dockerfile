# Build stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]
