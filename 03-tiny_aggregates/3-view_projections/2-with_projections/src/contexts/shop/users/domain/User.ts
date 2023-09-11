import { UserId } from "./UserId";
import { UserName } from "./UserName";
import { UserProfilePicture } from "./UserProfilePicture";

export type UserPrimitives = {
	id: string;
	name: string;
	profilePicture: string;
};

export class User {
	public readonly id: UserId;
	public readonly name: UserName;
	public readonly profilePicture: UserProfilePicture;

	constructor(id: string, name: string, profilePicture: string) {
		this.id = new UserId(id);
		this.name = new UserName(name);
		this.profilePicture = new UserProfilePicture(profilePicture);
	}

	static create(id: string, name: string, profilePicture: string): User {
		return new User(id, name, profilePicture);
	}

	toPrimitives(): UserPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			profilePicture: this.profilePicture.value,
		};
	}
}
