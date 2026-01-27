# Use Debian-based image for easier package management (vs Alpine for some tools)
FROM node:18-slim

# Install system dependencies for validators
RUN apt-get update && apt-get install -y \
    python3 \
    openjdk-17-jdk \
    clang \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
