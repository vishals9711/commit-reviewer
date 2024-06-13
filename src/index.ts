import { Command } from "commander";
import cowsay from "cowsay";
import { generateFolderStructureFromGit, getStagedChangesDiff } from "./folderFunctions/gitUtils";
import readReadmeFile from "./folderFunctions/readReadme";
import { runPrompt } from "./llmfunctions";

const program = new Command();

console.log(
	cowsay.say({
		text: "Search your commits, you know it to be true",
		f:"vader"
	}),
);

program
	.version("1.0.0")
	.description("CLI tool for reviewing code")
	.parse(process.argv);

const options = program.opts();

console.log("Reviewing staged changes");
generateReviewMessage();

async function generateReviewMessage() {
	try {
		const readme = await readReadmeFile();
		const diff = await getStagedChangesDiff();
		const folderStructure = await generateFolderStructureFromGit();

		const response = await runPrompt(readme, folderStructure, diff);

		console.log("Generated Message:\n\n", response);
	} catch (error) {
		console.error("Error generating message:", error);
	}
}

async function makeApiCall(messages: { role: string; content: string }[]) {
	try {
		console.log("Making API call to Llama-2-7B-Chat-GGUF model");

		const response = await fetch("http://localhost:7001/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "SanctumAI/Meta-Llama-3-8B-Instruct-GGUF",
				messages,
				temperature: 0.5,
				max_tokens: 200,
			}),
		});
		const data = await response.json();
		console.log(data);
		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error("Error making API call:", error);
		return null;
	}
}
