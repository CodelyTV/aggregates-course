/* eslint-disable no-console */
import "reflect-metadata";

import { Admin, Kafka } from "kafkajs";

import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";

async function main(admin: Admin): Promise<void> {
	await admin.connect();

	await admin.createTopics({
		topics: [
			{
				topic: "codely.mooc.courses",
				configEntries: [{ name: "cleanup.policy", value: "compact" }],
			},
		],
	});

	await admin.disconnect();
}

const kafka = container.get(Kafka);
const admin = kafka.admin();

main(admin)
	.catch(console.error)
	.finally(async () => {
		console.log("Done!");

		process.exit(0);
	});
