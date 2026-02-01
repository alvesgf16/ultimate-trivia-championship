# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files for monorepo
COPY package*.json ./
COPY turbo.json ./

# Copy workspace packages
COPY apps/api/package*.json ./apps/api/

# Install dependencies from root
RUN npm ci --ignore-scripts

# Copy API source code and configuration files
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json ./apps/api/

# Build the API application
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Copy API package files
COPY apps/api/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/apps/api/dist ./dist

# Create a non-root user and change ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]
