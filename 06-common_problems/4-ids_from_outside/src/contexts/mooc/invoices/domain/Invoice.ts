import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

import { InvoiceAmount } from "./InvoiceAmount";
import { InvoiceId } from "./InvoiceId";
import { InvoiceNumber } from "./InvoiceNumber";
import { InvoiceSerie } from "./InvoiceSerie";
import { InvoiceVatId } from "./InvoiceVatId";

export class Invoice extends AggregateRoot {
	constructor(
		readonly id: InvoiceId,
		readonly serie: InvoiceSerie,
		readonly number: InvoiceNumber,
		readonly amount: InvoiceAmount,
		readonly vatId: InvoiceVatId,
	) {
		super();
	}

	static fromPrimitives(primitives: Primitives<Invoice>): Invoice {
		return new Invoice(
			new InvoiceId(primitives.id),
			new InvoiceSerie(primitives.serie),
			new InvoiceNumber(primitives.number),
			new InvoiceAmount(primitives.amount),
			new InvoiceVatId(primitives.vatId),
		);
	}

	static create(
		id: string,
		serie: string,
		number: number,
		amount: number,
		vatId: string,
	): Invoice {
		return Invoice.fromPrimitives({
			id,
			serie,
			number,
			amount,
			vatId,
		});
	}

	toPrimitives(): Primitives<Invoice> {
		return {
			id: this.id.value,
			serie: this.serie.value,
			number: this.number.value,
			amount: this.amount.value,
			vatId: this.vatId.value,
		};
	}
}
