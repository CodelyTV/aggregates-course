import { SellerId } from "./SellerId";
import { SellerName } from "./SellerName";

export type SellerPrimitives = {
	id: string;
	name: string;
};

export class Seller {
	public readonly id: SellerId;
	public readonly name: SellerName;

	constructor(id: string, name: string) {
		this.id = new SellerId(id);
		this.name = new SellerName(name);
	}

	toPrimitives(): SellerPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
		};
	}
}
