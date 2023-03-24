# Nestjs Book shop

## Tech stack

- mongodb 5.0
- nestjs
- docker

## Dev tools

- husky
- commitlint
- lintstaged
- commitizen
- release-it

## Features

- [Auth JWT(salt, password Expired)](https://www.notion.so/Auth-User-JWT-2639381e66b8471e8f789aa81bd1b8ab?pvs=4)
- [Router](https://www.notion.so/Router-6815812f599340748c49cd7f1616fb12?pvs=4)
- Roles
- Error Message
- Users CRUD

## pre install

- have docker
- copy .env.example to .env
- change your env

### tsconfig

| enable esModuleInterop

```json
    "esModuleInterop": true
```

### mongodb

| we user version 5.0 and create user by root with init-mongo.sh

```yml
mongod:
  container_name: mongo
  image: mongo:5.0
  hostname: mongo
  ports:
    - 27017:27017
  env_file:
    - .env
  environment:
    - MONGO_INITDB_ROOT_USERNAME=$DB_ADMIN
    - MONGO_INITDB_ROOT_PASSWORD=$DB_ADMIN_PWD
    - MONGO_INITDB_DATABASE=$DB_NAME
    - MONGO_INITDB_USERNAME=$DB_USER
    - MONGO_INITDB_PASSWORD=$DB_USER_PWD
  volumes:
    - ./addons/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh
    - dbdata:/data/db
  restart: unless-stopped
  networks:
    - nestjs-network
```

```bash
mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);
    var user = '$MONGO_INITDB_USERNAME';
    var passwd = '$MONGO_INITDB_PASSWORD';
    db.createUser({ user: user, pwd: passwd, roles: ["readWrite"] });
EOF
```
