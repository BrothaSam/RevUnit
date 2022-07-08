import { FastifyInstance, FastifyRequest } from 'fastify';
import { Customer } from '../../models';

type CustomerRequest = FastifyRequest<{
    Params: {
        id: string;
    };
}>;

const customerById = async (server: FastifyInstance) => {
    server.get('/customer/:id', {}, async (request: CustomerRequest, reply) => {
        try {
            request.log.info('Getting customer by ID.');
            const { id } = request.params;
            const customer: Customer[] = await server.db.em
                .fork({})
                .findOne(Customer, {
                    deletedAt: null,
                    id: id
                });
            if (customer == null) {
                return reply.code(404).send('Customer not found.');
            }
            return reply.code(200).send(customer);
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send('Error fetching customer.');
        }
    });
};

export default customerById;
