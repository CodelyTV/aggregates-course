import { faker } from "@faker-js/faker";

import { InvoiceId } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceId";

export class InvoiceIdMother {
	static create(value?: string): InvoiceId {
		return new InvoiceId(value ?? faker.string.uuid());
	}
}
