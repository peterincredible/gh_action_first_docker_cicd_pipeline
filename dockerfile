FROM node:23-alpine


WORKDIR /app 

COPY package*.json ./ 

RUN npm install 

# Copy the rest of the application code to the container
COPY . . 

# Expose the port your app is listening on (e.g., 3000)
EXPOSE 3000 

# Define the command to start your application
CMD ["node", "app.js"]