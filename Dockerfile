# Use official Node.js LTS image with Alpine for smaller size
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only backend package files first for better caching
COPY backend/package*.json ./

# Install production dependencies only (no devDependencies)
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy public folder separately
COPY public/ ../public/

# Use the same port as your server.js (5000 instead of 3000)
EXPOSE 5000

# Use node directly instead of npm for better process handling
CMD ["node", "server.js"]

# Optional health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/api/health || exit 1