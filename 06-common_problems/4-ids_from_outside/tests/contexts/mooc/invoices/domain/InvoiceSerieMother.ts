import { faker } from "@faker-js/faker";

import { InvoiceSerie } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceSerie";

export class InvoiceSerieMother {
	static create(value?: string): InvoiceSerie {
		return new InvoiceSerie(
			value ?? faker.string.alpha({ length: 1, casing: "upper" }),
		);
	}
}
