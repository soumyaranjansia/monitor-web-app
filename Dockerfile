# Use a Node.js base image
FROM node:14  
# Choose an appropriate version

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "backend/server.js"]  # Update if necessary to point to your main entry file
