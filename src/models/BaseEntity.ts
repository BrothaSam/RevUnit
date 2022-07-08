import { Filter, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
@Filter({
    name: 'isDeleted',
    cond: { deletedAt: { $eq: null } },
    default: true
})
export abstract class BaseEntity {
    @PrimaryKey({ onCreate: () => uuid() })
    id!: string;

    @Property({ onCreate: () => new Date() })
    createdAt!: Date;

    @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
    updatedAt!: Date;

    @Property({ nullable: true })
    deletedAt?: Date;
}
