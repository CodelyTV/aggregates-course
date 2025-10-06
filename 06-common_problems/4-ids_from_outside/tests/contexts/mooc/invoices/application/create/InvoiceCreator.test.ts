import { InvoiceCreator } from "../../../../../../src/contexts/mooc/invoices/application/create/InvoiceCreator";
import { Invoice } from "../../../../../../src/contexts/mooc/invoices/domain/Invoice";
import { MockInvoiceRepository } from "../../infrastructure/MockInvoiceRepository";

describe("InvoiceCreator should", () => {
	const repository = new MockInvoiceRepository();
	const creator = new InvoiceCreator(repository);

	it("create an invoice with next number from repository", async () => {
		const id = "550e8400-e29b-41d4-a716-446655440000";
		const serie = "A";
		const amount = 1000;
		const vatId = "B12345678";
		const nextNumber = 5;

		repository.shouldReturnNextNumber(serie, nextNumber);

		const expectedInvoice = Invoice.create(
			id,
			serie,
			nextNumber,
			amount,
			vatId,
		);
		repository.shouldSave(expectedInvoice);

		await creator.create(id, serie, amount, vatId);
	});

	it("create invoice with number 1 for new serie", async () => {
		const id = "550e8400-e29b-41d4-a716-446655440001";
		const serie = "B";
		const amount = 2500.5;
		const vatId = "C98765432";
		const nextNumber = 1;

		repository.shouldReturnNextNumber(serie, nextNumber);

		const expectedInvoice = Invoice.create(
			id,
			serie,
			nextNumber,
			amount,
			vatId,
		);
		repository.shouldSave(expectedInvoice);

		await creator.create(id, serie, amount, vatId);
	});
});
