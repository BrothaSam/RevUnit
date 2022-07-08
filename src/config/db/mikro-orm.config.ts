import { Connection, IDatabaseDriver, Options } from '@mikro-orm/core';
import { Customer } from '../../models';

export const config: Options<IDatabaseDriver<Connection>> = {
    entities: [Customer],
    dbName: 'RevUnit',
    type: 'sqlite',
    debug: true
};
