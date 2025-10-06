import { InvoiceBySerieAndNumberSearcher } from "../../../../../../src/contexts/mooc/invoices/application/find-by-serie-and-number/InvoiceBySerieAndNumberSearcher";
import { InvoiceMother } from "../../domain/InvoiceMother";
import { InvoiceNumberMother } from "../../domain/InvoiceNumberMother";
import { InvoiceSerieMother } from "../../domain/InvoiceSerieMother";
import { MockInvoiceRepository } from "../../infrastructure/MockInvoiceRepository";

describe("InvoiceBySerieAndNumberFinder should", () => {
	const repository = new MockInvoiceRepository();
	const finder = new InvoiceBySerieAndNumberSearcher(repository);

	it("return null when invoice does not exist", async () => {
		const serie = InvoiceSerieMother.create();
		const number = InvoiceNumberMother.create();

		repository.shouldReturnInvoice(serie.value, number.value, null);

		const invoice = await finder.search(serie.value, number.value);

		expect(invoice).toBeNull();
	});

	it("find an existing invoice by serie and number", async () => {
		const expectedInvoice = InvoiceMother.create();
		const primitives = expectedInvoice.toPrimitives();

		repository.shouldReturnInvoice(
			primitives.serie,
			primitives.number,
			expectedInvoice,
		);

		const invoice = await finder.search(
			primitives.serie,
			primitives.number,
		);

		expect(invoice).not.toBeNull();
		expect(invoice?.toPrimitives()).toEqual(expectedInvoice.toPrimitives());
	});
});
