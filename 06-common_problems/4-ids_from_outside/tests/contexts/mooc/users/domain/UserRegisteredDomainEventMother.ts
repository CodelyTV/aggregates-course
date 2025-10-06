import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../../../../src/contexts/mooc/users/domain/User";
import { UserRegisteredDomainEvent } from "../../../../../src/contexts/mooc/users/domain/UserRegisteredDomainEvent";

import { UserBioMother } from "./UserBioMother";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";

export class UserRegisteredDomainEventMother {
	static create(
		params?: Partial<Primitives<User>>,
	): UserRegisteredDomainEvent {
		const primitives: Primitives<User> = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			bio: UserBioMother.create().value,
			email: UserEmailMother.create().value,
			suggestedCourses: "",
			...params,
		};

		return new UserRegisteredDomainEvent(
			primitives.id,
			primitives.name,
			primitives.bio,
			primitives.email,
		);
	}
}
