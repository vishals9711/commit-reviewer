import { Command } from "commander";
import cowsay from "cowsay";
import simpleGit from "simple-git";
import { generateFolderStructureFromGit, getCommitHistory, getStagedChangesDiff } from "./folderFunctions/gitUtils";
import readReadmeFile from "./folderFunctions/readReadme";
import { generatePrompt, generatePromptMessages } from "./llmfunctions";

const program = new Command();

console.log(
	cowsay.say({
		text: "Commit Message Generator",
	}),
);

program
	.version("1.0.0")
	.description("CLI tool for generating commit messages")
	.option("-g, --generate", "Generate a commit message")
	.parse(process.argv);

const options = program.opts();
const git = simpleGit();
console.log("Options:", options);

if (options.generate) {
	console.log("Generate option selected");
	generateCommitMessage();
} else {
	console.log("Generate option not selected");
}

async function generateCommitMessage() {
	try {
		const readme = await readReadmeFile();

		const commits = await getCommitHistory();

		const diff = await getStagedChangesDiff();

		const folderStructure = await generateFolderStructureFromGit();
		console.log("Folder structure:", folderStructure);
		const prompt = generatePrompt(readme, commits, folderStructure);

    	const messages = generatePromptMessages(prompt, diff);

		const response = await makeApiCall(messages);

		console.log("Generated Commit Message:\n\n ==========================\n", response);
	} catch (error) {
		console.error("Error generating commit message:", error);
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
				temperature: 0.2,
				max_tokens: -1,
				format: "json",
			}),
		});
		const data = await response.json();
		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error("Error making API call:", error);
		return null;
	}
}
