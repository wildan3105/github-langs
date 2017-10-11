FROM node:8.6-alpine
WORKDIR /app
COPY . .
EXPOSE 5000
RUN npm install
CMD ["npm", "start"]
