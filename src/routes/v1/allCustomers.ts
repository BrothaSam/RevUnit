import { QueryOrder } from '@mikro-orm/core';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Customer } from '../../models';

type CustomerRequest = FastifyRequest<{
    Querystring: {
        offset: number;
        limit: number;
    };
}>;
const allCustomers = async (server: FastifyInstance) => {
    server.get('/customers', {}, async (request: CustomerRequest, reply) => {
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
            return reply.code(500).send('Error fetching all customers.');
        }
    });
};

export default allCustomers;
