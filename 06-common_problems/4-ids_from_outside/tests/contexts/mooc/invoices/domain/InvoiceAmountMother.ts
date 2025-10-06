import { faker } from "@faker-js/faker";

import { InvoiceAmount } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceAmount";

export class InvoiceAmountMother {
	static create(value?: number): InvoiceAmount {
		return new InvoiceAmount(
			value ?? faker.number.float({ min: 1, max: 10000, fractionDigits: 2 }),
		);
	}
}
