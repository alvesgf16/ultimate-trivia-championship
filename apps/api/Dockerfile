# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
# Using npm install because this is a workspace and we need to generate a lock file for just this app
RUN npm install --frozen-lockfile=false

# Copy source code and configuration files
COPY src ./src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Build the application
RUN npm run build && ls -la /app/

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Copy only the dependency manifest files needed for install
COPY package.json ./

# Install only production dependencies
RUN npm install --frozen-lockfile=false --omit=dev --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

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
