import { Service } from "diod";

import { Invoice } from "../../domain/Invoice";
import { InvoiceRepository } from "../../domain/InvoiceRepository";

@Service()
export class InvoiceCreator {
	constructor(private readonly repository: InvoiceRepository) {}

	async create(
		id: string,
		serie: string,
		amount: number,
		vatId: string,
	): Promise<void> {
		const number = await this.repository.nextNumber(serie);

		const invoice = Invoice.create(id, serie, number, amount, vatId);

		await this.repository.save(invoice);
	}
}
