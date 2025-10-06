import { Service } from "diod";

import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { Invoice } from "../domain/Invoice";
import { InvoiceRepository } from "../domain/InvoiceRepository";

type DatabaseInvoiceRow = {
	id: string;
	serie: string;
	number: number;
	amount: number;
	vat_id: string;
};

@Service()
export class PostgresInvoiceRepository
	extends PostgresRepository<Invoice>
	implements InvoiceRepository
{
	async save(invoice: Invoice): Promise<void> {
		const primitives = invoice.toPrimitives();

		await this.execute`
			INSERT INTO mooc.invoices (id, serie, number, amount, vat_id)
			VALUES (
				${primitives.id},
				${primitives.serie},
				${primitives.number},
				${primitives.amount},
				${primitives.vatId}
			)
			ON CONFLICT (id) DO UPDATE SET
				serie = EXCLUDED.serie,
				number = EXCLUDED.number,
				amount = EXCLUDED.amount,
				vat_id = EXCLUDED.vat_id;
		`;
	}

	async nextNumber(serie: string): Promise<number> {
		const result = await this.execute`
			SELECT COALESCE(MAX(number), 0) + 1 AS next_number
			FROM mooc.invoices
			WHERE serie = ${serie};
		`;

		return (result[0] as { next_number: number }).next_number;
	}

	async searchBySerieAndNumber(
		serie: string,
		number: number,
	): Promise<Invoice | null> {
		return await this.searchOne`
			SELECT id, serie, number, amount::float, vat_id
			FROM mooc.invoices
			WHERE serie = ${serie} AND number = ${number};
		`;
	}

	protected toAggregate(row: DatabaseInvoiceRow): Invoice {
		return Invoice.fromPrimitives({
			id: row.id,
			serie: row.serie,
			number: row.number,
			amount: row.amount,
			vatId: row.vat_id,
		});
	}
}
