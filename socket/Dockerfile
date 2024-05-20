# Use the official Node.js 14 image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your socket server will use
EXPOSE 8800

# Command to run the socket server
CMD ["node", "index.js"]
