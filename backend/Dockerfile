# Build stage
FROM node:18

# Set working directory
WORKDIR /app

# Install netcat for the startup script
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY . .

# Generate Prisma client and migrate database
RUN npx prisma generate

# Make start script executable
RUN chmod +x start.sh

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
