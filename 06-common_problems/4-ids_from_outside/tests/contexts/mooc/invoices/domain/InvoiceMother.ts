import { faker } from "@faker-js/faker";

import { Invoice } from "../../../../../src/contexts/mooc/invoices/domain/Invoice";
import { InvoiceAmount } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceAmount";
import { InvoiceNumber } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceNumber";
import { InvoiceVatId } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceVatId";

import { InvoiceIdMother } from "./InvoiceIdMother";

export class InvoiceMother {
	static create(params?: {
		id?: string;
		serie?: string;
		number?: number;
		amount?: number;
		vatId?: string;
	}): Invoice {
		const id = InvoiceIdMother.create(params?.id);
		const serie =
			params?.serie ?? faker.string.alpha({ length: 1, casing: "upper" });
		const number =
			params?.number ?? faker.number.int({ min: 1, max: 9999 });
		const amount =
			params?.amount ??
			faker.number.float({ min: 1, max: 10000, fractionDigits: 2 });
		const vatId = params?.vatId ?? faker.string.alphanumeric(9);

		return new Invoice(
			id,
			serie,
			new InvoiceNumber(number),
			new InvoiceAmount(amount),
			new InvoiceVatId(vatId),
		);
	}
}
