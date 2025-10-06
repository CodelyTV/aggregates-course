import "reflect-metadata";

import { PostgresInvoiceRepository } from "../../../../../src/contexts/mooc/invoices/infrastructure/PostgresInvoiceRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { InvoiceMother } from "../domain/InvoiceMother";

const connection = container.get(PostgresConnection);
const repository = container.get(PostgresInvoiceRepository);

describe("PostgresInvoiceRepository should", () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("save an invoice", async () => {
		const invoice = InvoiceMother.create();

		await repository.save(invoice);
	});

	describe("nextNumber", () => {
		it("return 1 for a serie that does not exist", async () => {
			const nextNumber = await repository.nextNumber("A");

			expect(nextNumber).toBe(1);
		});

		it("return 2 when serie A already has invoice with number 1", async () => {
			const invoice = InvoiceMother.create({ serie: "A", number: 1 });
			await repository.save(invoice);

			const nextNumber = await repository.nextNumber("A");

			expect(nextNumber).toBe(2);
		});

		it("return correct next number when multiple invoices exist for the same serie", async () => {
			const invoice1 = InvoiceMother.create({ serie: "B", number: 1 });
			const invoice2 = InvoiceMother.create({ serie: "B", number: 2 });
			const invoice3 = InvoiceMother.create({ serie: "B", number: 3 });

			await repository.save(invoice1);
			await repository.save(invoice2);
			await repository.save(invoice3);

			const nextNumber = await repository.nextNumber("B");

			expect(nextNumber).toBe(4);
		});

		it("return 1 for a serie when other series have invoices", async () => {
			const invoiceSerieA = InvoiceMother.create({
				serie: "A",
				number: 5,
			});
			const invoiceSerieB = InvoiceMother.create({
				serie: "B",
				number: 3,
			});

			await repository.save(invoiceSerieA);
			await repository.save(invoiceSerieB);

			const nextNumber = await repository.nextNumber("C");

			expect(nextNumber).toBe(1);
		});

		it("not be affected by other series numbers", async () => {
			const invoiceSerieA1 = InvoiceMother.create({
				serie: "A",
				number: 1,
			});
			const invoiceSerieA2 = InvoiceMother.create({
				serie: "A",
				number: 2,
			});
			const invoiceSerieB1 = InvoiceMother.create({
				serie: "B",
				number: 1,
			});
			const invoiceSerieB2 = InvoiceMother.create({
				serie: "B",
				number: 2,
			});
			const invoiceSerieB3 = InvoiceMother.create({
				serie: "B",
				number: 3,
			});

			await repository.save(invoiceSerieA1);
			await repository.save(invoiceSerieA2);
			await repository.save(invoiceSerieB1);
			await repository.save(invoiceSerieB2);
			await repository.save(invoiceSerieB3);

			const nextNumberA = await repository.nextNumber("A");
			const nextNumberB = await repository.nextNumber("B");

			expect(nextNumberA).toBe(3);
			expect(nextNumberB).toBe(4);
		});
	});
});
