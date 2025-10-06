import { InvoiceCreator } from "../../../../../../src/contexts/mooc/invoices/application/create/InvoiceCreator";
import { InvoiceMother } from "../../domain/InvoiceMother";
import { MockInvoiceRepository } from "../../infrastructure/MockInvoiceRepository";

describe("InvoiceCreator should", () => {
	const repository = new MockInvoiceRepository();
	const creator = new InvoiceCreator(repository);

	it("create an invoice with next number from repository", async () => {
		const invoice = InvoiceMother.create();

		const invoicePrimitives = invoice.toPrimitives();

		repository.shouldReturnNextNumber(
			invoice.serie.value,
			invoicePrimitives.number,
		);

		repository.shouldSave(invoice);

		await creator.create(
			invoicePrimitives.id,
			invoicePrimitives.serie,
			invoicePrimitives.amount,
			invoicePrimitives.vatId,
		);
	});
});
