# Base image (Node.js 18.16.0)
FROM node:18.16.0

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
