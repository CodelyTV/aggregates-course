import { Invoice } from "../../../../../src/contexts/mooc/invoices/domain/Invoice";

import { InvoiceAmountMother } from "./InvoiceAmountMother";
import { InvoiceIdMother } from "./InvoiceIdMother";
import { InvoiceNumberMother } from "./InvoiceNumberMother";
import { InvoiceSerieMother } from "./InvoiceSerieMother";
import { InvoiceVatIdMother } from "./InvoiceVatIdMother";

export class InvoiceMother {
	static create(params?: {
		id?: string;
		serie?: string;
		number?: number;
		amount?: number;
		vatId?: string;
	}): Invoice {
		const id = InvoiceIdMother.create(params?.id);
		const serie = InvoiceSerieMother.create(params?.serie);
		const number = InvoiceNumberMother.create(params?.number);
		const amount = InvoiceAmountMother.create(params?.amount);
		const vatId = InvoiceVatIdMother.create(params?.vatId);

		return new Invoice(id, serie, number, amount, vatId);
	}
}
