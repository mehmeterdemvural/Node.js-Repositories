# Use an official Node.js runtime as the base image
FROM node:21.6.2-slim

# Set the working directory in the container
WORKDIR /web-apps/cleanblog

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install dependencies
RUN npm install

# Define the command to run the application
CMD [ "npm", "start" ]
