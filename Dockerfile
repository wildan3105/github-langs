FROM node:8.5-alpine
WORKDIR /app
COPY . .
EXPOSE 5000
RUN npm install
CMD ["node", "index.js"]
