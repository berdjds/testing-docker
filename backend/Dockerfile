# Build stage
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Start the server directly - no need for database wait script
CMD ["node", "app.js"]
