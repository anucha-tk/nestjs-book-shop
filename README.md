# Nestjs Book shop

## Features

- husky
- commitlint
- lintstaged
- commitizen
- release-it

## pre install

- have docker
- copy .env.example to .env

```bash
yarn add @nestjs/config
```

### tsconfig

| enable esModuleInterop

```typescript
import Joi from 'joi'; is work
import * as Joi from 'joi'; not work
```

```json
    "esModuleInterop": true
```
