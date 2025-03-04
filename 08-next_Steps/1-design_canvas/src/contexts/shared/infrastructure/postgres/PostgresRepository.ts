/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "diod";
import postgres, { Row } from "postgres";

import { AggregateRoot } from "../../domain/AggregateRoot";

import { PostgresConnection } from "./PostgresConnection";

@Service()
export abstract class PostgresRepository<T extends AggregateRoot> {
	private readonly sql: postgres.Sql;

	constructor(connection: PostgresConnection) {
		this.sql = connection.sql;
	}

	protected abstract toAggregate(row: Row): T;

	protected async searchOne(
		strings: TemplateStringsArray,
		...values: any[]
	): Promise<T | null> {
		const query = this.sql(strings, ...values);
		const result = await query;

		return result.length ? this.toAggregate(result[0]) : null;
	}

	protected async searchMany(
		strings: TemplateStringsArray,
		...values: any[]
	): Promise<T[]> {
		const query = this.sql(strings, ...values);
		const result = await query;

		return result.map((row) => this.toAggregate(row));
	}

	protected async execute(
		strings: TemplateStringsArray,
		...values: any[]
	): Promise<void> {
		await this.sql(strings, ...values);
	}
}
