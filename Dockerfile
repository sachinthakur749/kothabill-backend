# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create a logs directory and ensure the non-root user owns it
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs

USER appuser

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
