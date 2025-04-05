# Build stage
FROM node:18

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

# Expose frontend port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api

# Start the server
CMD ["npm", "start"]
