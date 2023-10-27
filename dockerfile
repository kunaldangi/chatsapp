FROM node:latest
WORKDIR /chatsapp
COPY . /chatsapp
RUN npm install
RUN npm install -g nodemon
EXPOSE 8080
CMD ["npm", "run", "dev"]
