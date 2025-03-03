/* eslint-disable no-console,@typescript-eslint/no-unnecessary-condition,no-await-in-loop,no-constant-condition,no-promise-executor-return */

type Course = {
	id: string;
	name: string;
	summary: string;
	categories: string[];
	publishedAt: string;
};

const categories = [
	"arquitectura-software",
	"testing",
	"frontend",
	"backend",
	"devops",
	"mobile",
] as const;

const courseNames = [
	"Clean Code",
	"SOLID",
	"Domain-Driven Design",
	"React Avanzado",
] as const;

function randomElementFrom<T>(array: readonly T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function generateFutureDate(): string {
	const now = new Date();
	const futureDate = new Date(
		now.setMonth(now.getMonth() + Math.floor(Math.random() * 12)),
	);

	return futureDate.toISOString().split("T")[0];
}

function generateCourse(): Course {
	const id = Math.random().toString(36).substring(2, 6);
	const name = `Curso avanzado de ${randomElementFrom(courseNames)} x${Math.floor(Math.random() * 1000)}`;
	const category = randomElementFrom(categories);

	return {
		id,
		name,
		summary: `Summary del curso ${name}`,
		categories: [category],
		publishedAt: generateFutureDate(),
	};
}

async function createCourse(course: Course): Promise<void> {
	await fetch(`http://localhost:3000/api/mooc/courses/${course.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(course),
	});
}

async function main(requestsPerSecond: number): Promise<void> {
	const batchSize = 100;
	let totalCoursesCreated = 0;

	while (true) {
		const startTime = Date.now();
		const courseBatch = Array.from({ length: batchSize }, () =>
			generateCourse(),
		);

		await Promise.all(courseBatch.map(createCourse));

		totalCoursesCreated += batchSize;

		console.log(`${totalCoursesCreated} courses created`);

		const elapsedTime = Date.now() - startTime;
		const targetTime = (1000 * batchSize) / requestsPerSecond;

		if (elapsedTime < targetTime) {
			await new Promise((resolve) =>
				setTimeout(resolve, targetTime - elapsedTime),
			);
		}
	}
}

process.on("SIGINT", () => {
	console.log("\nGracefully shutting down...");
	process.exit(0);
});

main(500)
	.catch((error) => {
		console.error("Error:", error);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Done!");

		process.exit(0);
	});
