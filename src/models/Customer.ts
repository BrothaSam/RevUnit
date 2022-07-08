import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Customer extends BaseEntity {
    @Property()
    firstName!: string;
    @Property()
    lastName!: string;
    @Property()
    address1!: string;
    @Property({ nullable: true })
    address2?: string;
    @Property()
    city!: string;
    @Property()
    state!: string;
    @Property()
    postalCode!: string;
    @Property()
    dateOfBirth!: Date;
    @Property()
    email!: string;
    @Property()
    phone!: string;

    constructor(
        firstName: string,
        lastName: string,
        address1: string,
        address2: string,
        city: string,
        state: string,
        postalCode: string,
        dateOfBirth: Date,
        email: string,
        phone: string
    ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phone = phone;
    }
}
