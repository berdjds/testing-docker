# 1. Use official Node image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies with legacy peer deps (for compatibility)
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the app
COPY . .

# 6. Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 7. Build the Next.js app
RUN npm run build

# 8. Clean dev dependencies
RUN npm prune --production

# 9. Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]
