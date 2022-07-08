import { FastifyInstance, FastifyRequest } from 'fastify';
import { Customer } from '../../models';

type CustomerRequest = FastifyRequest<{
    Body: {
        firstName: string;
        lastName: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        postalCode: string;
        dateOfBirth: Date;
        email: string;
        phone: string;
    };
}>;

const PostCustomerSchema = {
    type: 'object',
    required: [
        'firstName',
        'lastName',
        'address1',
        'city',
        'state',
        'postalCode',
        'dateOfBirth',
        'email',
        'phone'
    ],
    properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', maxLength: 50 },
        address1: { type: 'string', maxLength: 500 },
        address2: { type: 'string', maxLength: 500 },
        city: { type: 'string', maxLength: 100 },
        state: { type: 'string', maxLength: 40 },
        postalCode: { type: 'string', minLength: 5, maxLength: 5 },
        dateOfBirth: { type: 'string', format: 'date' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', minLength: 11, maxLength: 11 }
    }
};
const customerById = async (server: FastifyInstance) => {
    server.post(
        '/customer',
        { schema: { body: PostCustomerSchema } },
        async (request: CustomerRequest, reply) => {
            try {
                request.log.info('Creating customer.');

                const {
                    firstName,
                    lastName,
                    address1,
                    address2,
                    city,
                    state,
                    postalCode,
                    dateOfBirth,
                    email,
                    phone
                } = request.body;

                const customer = new Customer(
                    firstName,
                    lastName,
                    address1,
                    address2,
                    city,
                    state,
                    postalCode,
                    dateOfBirth,
                    email,
                    phone
                );
                const id = await server.db.em
                    .fork({})
                    .persistAndFlush([customer]);
                return reply.code(201).send('Created customer');
            } catch (err) {
                request.log.error(err);
                return reply.code(500).send('Error creating customer.');
            }
        }
    );
};

export default customerById;
