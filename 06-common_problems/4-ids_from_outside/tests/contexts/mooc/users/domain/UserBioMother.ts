import { faker } from "@faker-js/faker";

import { UserBio } from "../../../../../src/contexts/mooc/users/domain/UserBio";

export class UserBioMother {
	static create(value?: string): UserBio {
		return new UserBio(value ?? faker.lorem.paragraph());
	}
}
