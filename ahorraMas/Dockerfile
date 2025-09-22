# paso 1
FROM node:20-alpine AS build

ARG VERSION
ENV VITE_APP_VERSION=$VERSION 

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p public/config && \
    echo "window._env_ = window._env_ || {};" > public/config/version.env.js && \
    echo "window._env_.VERSION = \"$VERSION\";" >> public/config/version.env.js


RUN npm run build
#############################################################################
# paso 2
FROM nginx:alpine

ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/app

COPY ./entryPoint.sh /
RUN chmod +x entryPoint.sh

EXPOSE 80
ENTRYPOINT ["/bin/sh","/entryPoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

