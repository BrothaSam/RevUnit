import fastify from 'fastify';
import { MikroORM, IDataBaseDriver, Connection } from '@mikro-orm/core';

declare module 'fastify' {
    export interface FastifyInstance<> {
        db: MikroORM<IDataBaseDriver<Connection>>;
    }
}
