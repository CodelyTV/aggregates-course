import { Ollama } from "@langchain/ollama";

export async function evaluatePrompt(
	expected: string,
	actual: string,
): Promise<number> {
	const ollama = new Ollama({
		model: "gemma3:latest",
		temperature: 0,
	});

	const evaluationPrompt = `
You are evaluating if a prompt correctly instructs to use a specific tool.

Expected: ${expected}
Actual prompt: "${actual}"

Does the actual prompt correctly instruct to use the expected tool? 
Answer with a score from 0 to 1, where 1 means perfect match and 0 means no match.
Just respond with a number between 0 and 1, nothing else.
`;

	const evaluationResult = await ollama.invoke(evaluationPrompt);

	return parseFloat(evaluationResult.trim());
}
