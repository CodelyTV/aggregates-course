import postgres from "postgres";

export class PostgresConnection {
	public readonly sql: postgres.Sql;

	constructor(
		host: string,
		port: number,
		user: string,
		password: string,
		database: string,
	) {
		this.sql = postgres({
			host,
			port,
			user,
			password,
			database,
			onnotice: () => {},
		});
	}

	async end(): Promise<void> {
		await this.sql.end();
	}

	async truncateAll(): Promise<void> {
		await this.sql`DO
$$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename
              FROM pg_tables
              WHERE schemaname IN ('shop', 'shared', 'product'))
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END
$$;`;
	}
}
