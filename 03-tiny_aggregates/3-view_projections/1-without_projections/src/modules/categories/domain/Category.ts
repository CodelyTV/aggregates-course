import { CategoryId } from "./CategoryId";
import { CategoryName } from "./CategoryName";

export type CategoryPrimitives = {
	id: string;
	name: string;
};

export class Category {
	public readonly id: CategoryId;
	public readonly name: CategoryName;

	constructor(id: string, name: string) {
		this.id = new CategoryId(id);
		this.name = new CategoryName(name);
	}

	toPrimitives(): CategoryPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
		};
	}
}
