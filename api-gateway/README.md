# API Gateway

## License
Nest is [MIT licensed]().


## Running NATS Server with Docker

```
docker run -d --name=nats-2 --link nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats 
```

## dev

1. Clonar el repo
2. Instalar las dependencias
3. Crear un archivo .env en la raiz del proyecto con las variables de entorno necesarias (ver .env.template)
4. Levantar el servidor NATS (docker run -d --name=nats-2 --link nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats)
5. Levantar los microservicios (products-service, orders-service, etc)
6. Levantar el client-gateway (pnpm run start:dev)

