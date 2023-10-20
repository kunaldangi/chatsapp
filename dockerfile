FROM node:latest
WORKDIR /chatsapp
COPY . /chatsapp
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "dev"]