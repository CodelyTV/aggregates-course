import { Invoice } from "./Invoice";

export abstract class InvoiceRepository {
	abstract save(invoice: Invoice): Promise<void>;

	abstract nextNumber(serie: string): Promise<number>;
}
