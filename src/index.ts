import { fastify } from 'fastify';
import pino from 'pino';

const PORT = process.env.PORT || 3000;

const server = fastify({ logger: pino({ level: 'info' }) });

server.get('/ping', async (request, reply) => {
    return 'pong\n';
});

server.listen({ port: PORT as number }, (err, address) => {
    if (err) {
        server.log.error(`Error starting server, ${err}`);
        process.exit(1);
    }
    server.log.info(`Server running at ${address}`);
});
