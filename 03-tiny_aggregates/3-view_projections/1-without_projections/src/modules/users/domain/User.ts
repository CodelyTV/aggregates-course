import { UserId } from "./UserId";
import { UserName } from "./UserName";

export type UserPrimitives = {
	id: string;
	name: string;
};

export class User {
	public readonly id: UserId;
	public readonly name: UserName;

	constructor(id: string, name: string) {
		this.id = new UserId(id);
		this.name = new UserName(name);
	}

	static create(id: string, name: string): User {
		return new User(id, name);
	}

	toPrimitives(): UserPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
		};
	}
}
