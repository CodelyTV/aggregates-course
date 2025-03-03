import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../../../../src/contexts/mooc/users/domain/User";
import { UserStatus } from "../../../../../src/contexts/mooc/users/domain/UserStatus";

import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";
import { UserProfilePictureMother } from "./UserProfilePictureMother";

export class UserMother {
	static create(params?: Partial<Primitives<User>>): User {
		const id = UserIdMother.create().value;

		const primitives: Primitives<User> = {
			aggregateId: id,
			aggregateName: "codely.mooc.users",
			id,
			name: UserNameMother.create().value,
			email: UserEmailMother.create().value,
			profilePicture: UserProfilePictureMother.create().value,
			status: UserStatus.Active,
			...params,
		};

		return User.fromPrimitives(primitives);
	}
}
