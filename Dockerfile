# Use official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if exists)
COPY backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
