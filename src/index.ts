import { MikroORM } from '@mikro-orm/core';
import { fastify } from 'fastify';
import path from 'path';
import pino from 'pino';
import autoLoad from '@fastify/autoload';
import { config } from './config/db/mikro-orm.config';
import { v4 as uuid } from 'uuid';
import cors from '@fastify/cors';
import 'dotenv/config';

(async function () {
    const PORT = process.env.PORT || 3000;
    const API_KEY = process.env.API_KEY;

    //define fastify instance
    const server = fastify({
        logger: pino({ level: 'info' }),
        genReqId() {
            return uuid();
        }
    });

    //wait for db to initialize. log with server logger
    const orm = await MikroORM.init({
        ...config,
        logger: (msg) => server.log.info(msg)
    });

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    //set db on server for use in routes
    server.decorate('db', orm);

    //cors for ui and swagger. would normally define specific hosts if not in domain
    server.register(cors, {
        origin: true
    });

    //autoload routes based on path
    server.register(autoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { prefix: '', recursive: true }
    });

    //simple api key based auth. uuid defined in .env
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

    //use request ID as trace for debugging
    server.addHook('preHandler', (request, reply, done) => {
        const id = request.id;
        reply.headers({ 'x-trace-id': id });
        done();
    });

    //start server
    server.listen({ port: PORT as number }, async (err, address) => {
        if (err) {
            server.log.error(`Error starting server, ${err}`);
            process.exit(1);
        }

        server.log.info(`Server running at ${address}`);
    });
})();
