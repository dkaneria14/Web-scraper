FROM node:20-alpine as prod-build
WORKDIR /client
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json *.json *.js ./
RUN npm i
COPY ./src ./src
COPY ./public ./public
ARG REACT_APP_SERVER_ENDPOINT
ENV REACT_APP_SERVER_ENDPOINT=$REACT_APP_SERVER_ENDPOINT
RUN npm run build

# Serve Static React Pages
FROM nginx:1.25.3-alpine
EXPOSE 80
EXPOSE 443
EXPOSE 8001
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod-build /client/build /usr/share/nginx/html