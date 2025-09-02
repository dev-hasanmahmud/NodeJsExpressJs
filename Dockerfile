# Use official Node.js LTS image
FROM node:22

# Set working directory in container
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose the port your Express app uses
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
