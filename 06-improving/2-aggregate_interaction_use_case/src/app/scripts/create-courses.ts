/* eslint-disable no-console */
import "reflect-metadata";

import jsonCourses from "./../../../etc/courses.json";

async function main(): Promise<void> {
	await Promise.all(
		jsonCourses.map(async (course) => {
			await fetch(`http://localhost:3000/api/mooc/courses/${course.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(course),
			});
		}),
	);
}

main()
	.catch(console.error)
	.finally(async () => {
		console.log("Done!");

		process.exit(0);
	});
