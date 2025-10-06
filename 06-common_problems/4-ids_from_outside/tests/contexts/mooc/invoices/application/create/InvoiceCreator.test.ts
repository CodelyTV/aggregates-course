import { InvoiceCreator } from "../../../../../../src/contexts/mooc/invoices/application/create/InvoiceCreator";
import { Invoice } from "../../../../../../src/contexts/mooc/invoices/domain/Invoice";
import { InvoiceAmountMother } from "../../domain/InvoiceAmountMother";
import { InvoiceIdMother } from "../../domain/InvoiceIdMother";
import { InvoiceNumberMother } from "../../domain/InvoiceNumberMother";
import { InvoiceSerieMother } from "../../domain/InvoiceSerieMother";
import { InvoiceVatIdMother } from "../../domain/InvoiceVatIdMother";
import { MockInvoiceRepository } from "../../infrastructure/MockInvoiceRepository";

describe("InvoiceCreator should", () => {
	const repository = new MockInvoiceRepository();
	const creator = new InvoiceCreator(repository);

	it("create an invoice with next number from repository", async () => {
		const id = InvoiceIdMother.create("550e8400-e29b-41d4-a716-446655440000");
		const serie = InvoiceSerieMother.create("A");
		const amount = InvoiceAmountMother.create(1000);
		const vatId = InvoiceVatIdMother.create("B12345678");
		const nextNumber = InvoiceNumberMother.create(5);

		repository.shouldReturnNextNumber(serie.value, nextNumber.value);

		const expectedInvoice = Invoice.create(
			id.value,
			serie.value,
			nextNumber.value,
			amount.value,
			vatId.value,
		);
		repository.shouldSave(expectedInvoice);

		await creator.create(id.value, serie.value, amount.value, vatId.value);
	});

	it("create invoice with number 1 for new serie", async () => {
		const id = InvoiceIdMother.create("550e8400-e29b-41d4-a716-446655440001");
		const serie = InvoiceSerieMother.create("B");
		const amount = InvoiceAmountMother.create(2500.5);
		const vatId = InvoiceVatIdMother.create("C98765432");
		const nextNumber = InvoiceNumberMother.create(1);

		repository.shouldReturnNextNumber(serie.value, nextNumber.value);

		const expectedInvoice = Invoice.create(
			id.value,
			serie.value,
			nextNumber.value,
			amount.value,
			vatId.value,
		);
		repository.shouldSave(expectedInvoice);

		await creator.create(id.value, serie.value, amount.value, vatId.value);
	});
});
