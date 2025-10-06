import { faker } from "@faker-js/faker";

import { InvoiceNumber } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceNumber";

export class InvoiceNumberMother {
	static create(value?: number): InvoiceNumber {
		return new InvoiceNumber(
			value ?? faker.number.int({ min: 1, max: 9999 }),
		);
	}
}
