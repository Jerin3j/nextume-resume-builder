FROM node:20

WORKDIR /app

COPY package*.json ./

# improve npm reliability
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retry-maxtimeout 600000 \
 && npm config set fetch-retry-mintimeout 20000

# install dependencies
RUN npm install --no-audit --no-fund

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]