CREATE SCHEMA mooc;

CREATE TABLE mooc.courses (
	id CHAR(4) PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	summary TEXT,
	categories JSONB NOT NULL,
	published_at TIMESTAMP WITH TIME ZONE NOT NULL,
	embedding vector(768)
);

CREATE TABLE mooc.users (
	id uuid PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	bio TEXT NOT NULL,
	email TEXT NOT NULL,
	suggested_courses jsonb
);

CREATE TABLE mooc.user_course_suggestions (
	user_id uuid PRIMARY KEY NOT NULL,
	completed_course_ids jsonb,
	suggested_courses jsonb
);
