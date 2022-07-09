import { QueryOrder } from '@mikro-orm/core';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Customer } from '../models/db';

//libraries available to get types based on JSON schema, but decided to go this route for simplicity and to be explicit.
type CustomerRequest = FastifyRequest<{
    Querystring: {
        offset: number;
        limit: number;
    };
}>;

const GetCustomersSchema = {
    type: 'object',
    properties: {
        offset: { type: 'number', format: 'int32', minimum: 1 },
        limit: { type: 'number', format: 'int32', minimum: 1 }
    }
};
const allCustomers = async (server: FastifyInstance) => {
    server.get(
        '/customers',
        { schema: { querystring: GetCustomersSchema } },
        async (request: CustomerRequest, reply) => {
            try {
                request.log.info('Getting all customers');
                const offset = request.query.offset || 0;
                const limit = request.query.limit || 10;
                const [customers, count]: Customer[] = await server.db.em
                    .fork({})
                    .findAndCount(
                        Customer,
                        {
                            deletedAt: null
                        },
                        {
                            orderBy: { createdAt: QueryOrder.ASC },
                            limit: limit,
                            offset: offset
                        }
                    );
                return reply.code(200).send({
                    customers,
                    pagination: { currentOffset: offset, count }
                });
            } catch (err) {
                request.log.error(err);
                //basic error response. could use something like RFC7807
                return reply.code(500).send('Error fetching all customers.');
            }
        }
    );
};

export default allCustomers;
