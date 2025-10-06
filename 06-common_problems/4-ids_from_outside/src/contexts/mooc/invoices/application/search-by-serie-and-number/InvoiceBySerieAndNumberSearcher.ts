import { Service } from "diod";

import { Invoice } from "../../domain/Invoice";
import { InvoiceRepository } from "../../domain/InvoiceRepository";

@Service()
export class InvoiceBySerieAndNumberSearcher {
	constructor(private readonly repository: InvoiceRepository) {}

	async search(serie: string, number: number): Promise<Invoice | null> {
		return this.repository.searchBySerieAndNumber(serie, number);
	}
}
