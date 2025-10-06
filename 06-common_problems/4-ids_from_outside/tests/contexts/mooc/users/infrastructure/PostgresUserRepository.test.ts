import "reflect-metadata";

import { PostgresUserRepository } from "../../../../../src/contexts/mooc/users/infrastructure/PostgresUserRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { UserIdMother } from "../domain/UserIdMother";
import { UserMother } from "../domain/UserMother";

const connection = container.get(PostgresConnection);
const repository = container.get(PostgresUserRepository);

describe("PostgresUserRepository should", () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("save a user", async () => {
		const user = UserMother.create();

		await repository.save(user);
	});

	it("return null searching a non existing user", async () => {
		const userId = UserIdMother.create();

		expect(await repository.search(userId)).toBeNull();
	});

	it("return existing user", async () => {
		const user = UserMother.create();

		await repository.save(user);

		expect(await repository.search(user.id)).toStrictEqual(user);
	});
});
