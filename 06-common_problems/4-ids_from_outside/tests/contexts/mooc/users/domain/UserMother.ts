import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../../../../src/contexts/mooc/users/domain/User";

import { UserBioMother } from "./UserBioMother";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";

export class UserMother {
	static create(params?: Partial<Primitives<User>>): User {
		const primitives: Primitives<User> = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			bio: UserBioMother.create().value,
			email: UserEmailMother.create().value,
			suggestedCourses: "",
			...params,
		};

		return User.fromPrimitives(primitives);
	}
}
