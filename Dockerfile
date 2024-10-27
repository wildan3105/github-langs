FROM node:18.10.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run lint && npm run test

FROM node:18.10.0

WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000

CMD ["npm", "run", "start-prod"]
