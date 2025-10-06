import { Invoice } from "../../../../../src/contexts/mooc/invoices/domain/Invoice";
import { InvoiceRepository } from "../../../../../src/contexts/mooc/invoices/domain/InvoiceRepository";

export class MockInvoiceRepository implements InvoiceRepository {
	private readonly mockSave = jest.fn();
	private readonly mockNextNumber = jest.fn();
	private readonly mockSearchBySerieAndNumber = jest.fn();

	async save(invoice: Invoice): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(invoice.toPrimitives());

		return Promise.resolve();
	}

	async nextNumber(serie: string): Promise<number> {
		expect(this.mockNextNumber).toHaveBeenCalledWith(serie);

		return this.mockNextNumber() as Promise<number>;
	}

	async searchBySerieAndNumber(
		serie: string,
		number: number,
	): Promise<Invoice | null> {
		expect(this.mockSearchBySerieAndNumber).toHaveBeenCalledWith(
			serie,
			number,
		);

		return this.mockSearchBySerieAndNumber() as Promise<Invoice | null>;
	}

	shouldSave(invoice: Invoice): void {
		this.mockSave(invoice.toPrimitives());
	}

	shouldReturnNextNumber(serie: string, nextNumber: number): void {
		this.mockNextNumber(serie);
		this.mockNextNumber.mockReturnValueOnce(nextNumber);
	}

	shouldReturnInvoice(
		serie: string,
		number: number,
		invoice: Invoice | null,
	): void {
		this.mockSearchBySerieAndNumber(serie, number);
		this.mockSearchBySerieAndNumber.mockReturnValueOnce(invoice);
	}
}
