# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Nest.js application files to the container
COPY . .

# Expose the port that your Nest.js app will run on
EXPOSE 80

# Specify the default environment (dev by default)
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

# Copy the environment-specific configuration file
COPY .env.${NODE_ENV} .env

# Command to run your Nest.js application
CMD ["npm", "run", "start:docker"]
