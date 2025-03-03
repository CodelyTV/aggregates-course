CREATE SCHEMA mooc;

CREATE TABLE mooc.users (
	id uuid PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255) NOT NULL,
	status VARCHAR(255) NOT NULL
);

CREATE TABLE mooc.courses (
	id CHAR(4) PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	summary TEXT,
	categories jsonb NOT NULL,
	published_at DATE NOT NULL
);
