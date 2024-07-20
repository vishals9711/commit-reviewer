import { Command } from "commander";
import cowsay from "cowsay";
import generateReviewMessage from "./llmfunctions";

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
	.option('-b, --branch <branch>', 'Add branch name to compare current branch with')
	.parse(process.argv);

const options = program.opts();

const {branch} = options;

console.log(`Reviewing changes against ${branch} branch`);
generateReviewMessage(branch);

