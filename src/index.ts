import { MikroORM } from '@mikro-orm/core';
import { fastify } from 'fastify';
import path from 'path';
import pino from 'pino';
import autoLoad from '@fastify/autoload';
import { config } from './config/db/mikro-orm.config';
import { v4 as uuid } from 'uuid';
import 'dotenv/config';

(async function () {
    const PORT = process.env.PORT || 3000;
    const API_KEY = process.env.API_KEY;

    const server = fastify({
        logger: pino({ level: 'info' }),
        genReqId(req) {
            return uuid();
        }
    });

    const orm = await MikroORM.init({
        ...config,
        logger: (msg) => server.log.info(msg)
    });

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    server.decorate('db', orm);

    server.register(autoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { prefix: '', recursive: true }
    });

    server.addHook('onRequest', (request, reply, done) => {
        const reqApiKey = request.headers.apikey;
        if (!reqApiKey || reqApiKey !== API_KEY) {
            request.log.info('Client not authorized.');
            reply.code(401).send('Unauthorized');
        } else {
            request.log.info('Client authorized.');
        }
        done();
    });

    server.addHook('preHandler', (request, reply, done) => {
        const id = request.id;
        reply.headers({ 'x-trace-id': id });
        done();
    });

    server.listen({ port: PORT as number }, async (err, address) => {
        if (err) {
            server.log.error(`Error starting server, ${err}`);
            process.exit(1);
        }

        server.log.info(`Server running at ${address}`);
    });
})();
