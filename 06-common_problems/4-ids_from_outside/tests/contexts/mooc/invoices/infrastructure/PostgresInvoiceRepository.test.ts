import "reflect-metadata";

import { PostgresInvoiceRepository } from "../../../../../src/contexts/mooc/invoices/infrastructure/PostgresInvoiceRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { InvoiceMother } from "../domain/InvoiceMother";
import { InvoiceSerieMother } from "../domain/InvoiceSerieMother";

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
			const serie = InvoiceSerieMother.create();

			const nextNumber = await repository.nextNumber(serie.value);

			expect(nextNumber).toBe(1);
		});

		it("return 2 when serie already has invoice with number 1", async () => {
			const serie = InvoiceSerieMother.create();
			const invoice = InvoiceMother.create({
				serie: serie.value,
				number: 1,
			});
			await repository.save(invoice);

			const nextNumber = await repository.nextNumber(serie.value);

			expect(nextNumber).toBe(2);
		});

		it("return correct next number when multiple invoices exist for the same serie", async () => {
			const serie = InvoiceSerieMother.create();
			const invoice1 = InvoiceMother.create({
				serie: serie.value,
				number: 1,
			});
			const invoice2 = InvoiceMother.create({
				serie: serie.value,
				number: 2,
			});
			const invoice3 = InvoiceMother.create({
				serie: serie.value,
				number: 3,
			});

			await repository.save(invoice1);
			await repository.save(invoice2);
			await repository.save(invoice3);

			const nextNumber = await repository.nextNumber(serie.value);

			expect(nextNumber).toBe(4);
		});

		it("return 1 for a serie when other series have invoices", async () => {
			const serieA = InvoiceSerieMother.create();
			const serieB = InvoiceSerieMother.create();
			const serieC = InvoiceSerieMother.create();

			const invoiceSerieA = InvoiceMother.create({ serie: serieA.value });
			const invoiceSerieB = InvoiceMother.create({ serie: serieB.value });

			await repository.save(invoiceSerieA);
			await repository.save(invoiceSerieB);

			const nextNumber = await repository.nextNumber(serieC.value);

			expect(nextNumber).toBe(1);
		});

		it("not be affected by other series numbers", async () => {
			const serieA = InvoiceSerieMother.create();
			const serieB = InvoiceSerieMother.create();
			const invoiceSerieA1 = InvoiceMother.create({
				serie: serieA.value,
				number: 1,
			});
			const invoiceSerieA2 = InvoiceMother.create({
				serie: serieA.value,
				number: 2,
			});
			const invoiceSerieB1 = InvoiceMother.create({
				serie: serieB.value,
				number: 1,
			});
			const invoiceSerieB2 = InvoiceMother.create({
				serie: serieB.value,
				number: 2,
			});
			const invoiceSerieB3 = InvoiceMother.create({
				serie: serieB.value,
				number: 3,
			});

			await repository.save(invoiceSerieA1);
			await repository.save(invoiceSerieA2);
			await repository.save(invoiceSerieB1);
			await repository.save(invoiceSerieB2);
			await repository.save(invoiceSerieB3);

			const nextNumberA = await repository.nextNumber(serieA.value);
			const nextNumberB = await repository.nextNumber(serieB.value);

			expect(nextNumberA).toBe(3);
			expect(nextNumberB).toBe(4);
		});
	});
});
