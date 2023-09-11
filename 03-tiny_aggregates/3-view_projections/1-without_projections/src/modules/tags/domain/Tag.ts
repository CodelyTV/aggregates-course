import { TagId } from "./TagId";
import { TagName } from "./TagName";

export type TagPrimitives = {
	id: string;
	name: string;
};

export class Tag {
	public readonly id: TagId;
	public readonly name: TagName;

	constructor(id: string, name: string) {
		this.id = new TagId(id);
		this.name = new TagName(name);
	}

	toPrimitives(): TagPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
		};
	}
}
