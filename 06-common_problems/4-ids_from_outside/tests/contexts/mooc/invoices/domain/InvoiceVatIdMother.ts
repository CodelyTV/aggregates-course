import { faker } from "@faker-js/faker";

import { InvoiceVatId } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceVatId";

export class InvoiceVatIdMother {
	static create(value?: string): InvoiceVatId {
		return new InvoiceVatId(value ?? faker.string.alphanumeric(9));
	}
}
