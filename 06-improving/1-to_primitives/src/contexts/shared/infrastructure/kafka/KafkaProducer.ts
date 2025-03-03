import { Service } from "diod";
import { Kafka, Producer } from "kafkajs";

@Service()
export class KafkaProducer {
	private readonly producer: Producer;

	constructor(kafka: Kafka) {
		this.producer = kafka.producer();
	}

	async send(
		topic: string,
		message: string | Buffer | null,
		aggregateId: string,
	): Promise<void> {
		await this.producer.connect();
		await this.producer.send({
			topic,
			messages: [
				{
					key: aggregateId,
					value: message,
				},
			],
		});
	}
}
