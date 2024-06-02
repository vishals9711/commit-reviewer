import fs from "node:fs";
import { Command } from "commander";
import cowsay from "cowsay";
import simpleGit from "simple-git";
import path from "node:path";
import ignore, { type Ignore } from "ignore";

// import {execaSync} from 'execa';
import execShexec from 'exec-sh';
import { promisify } from "node:util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
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
		// Read README file
		const readme = await readReadmeFile();

		// Get commit history
		const commits = await getCommitHistory();

		// Get the diff of staged changes
		const diff = await getStagedChangesDiff();

		// Generate folder structure from Git
		const folderStructure = await generateFolderStructureFromGit();
    console.log("Folder structure:", folderStructure);
		// Construct the prompt
		const prompt = generatePrompt(readme, commits, "folderStructure");

    const messages = [{
      role: 'system',
      content: prompt,
    },
    {
      role: 'user',
      content: `Given this diff, write a concise git commit message for the following code diff only return the commit message : \n${diff}`,
    },]

		// Make API call to Llama-2-7B-Chat-GGUF model
		const response = await makeApiCall(messages);

		console.log("Generated Commit Message:", response);
	} catch (error) {
		console.error("Error generating commit message:", error);
	}
}

async function readReadmeFile() {
	try {
		const readme = await new Promise<string>((resolve, reject) => {
			fs.readFile("README.md", "utf-8", (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		console.log("README.md found and read");
		return readme;
	} catch (error) {
		console.error("Error reading README.md file:", error);
		return "";
	}
}

async function getCommitHistory() {
	try {
		const log = await git.log();
		const commits = log.all.map((commit, index) => {
			return {
				index: index + 1,
				message: commit.message,
			};
		});
		console.log("Commits retrieved :: ", JSON.stringify(commits));
		console.log("Commit history retrieved");
		return JSON.stringify(commits);
	} catch (error) {
		console.error("Error getting commit history:", error);
		return "";
	}
}

async function getStagedChangesDiff() {
	try {
		const diff = await git.diff(["--cached"]);
		console.log("Diff of staged changes retrieved");
		return diff;
	} catch (error) {
		console.error("Error getting staged changes diff:", error);
		return "";
	}
}


async function generateFolderStructureFromGit(): Promise<string> {
  try {
    // Read .gitignore and create an ignore instance
    const gitignore: string = await readFile(".gitignore", "utf-8");
    const ig: Ignore = ignore().add(gitignore.split("\n").filter(line => line && !line.startsWith("#")));
    // .git folder is ignored by default
    ig.ignores(".git");

    // Function to recursively get folder structure
    const getFolderStructure = async (dir: string, depth: number): Promise<string> => {
      let folderStructure = "";
      const items: string[] = await readdir(dir);
      for (const item of items) {
        const fullPath: string = path.join(dir, item);
        const relativePath: string = path.relative(process.cwd(), fullPath);
        const isIgnored: boolean = ig.ignores(relativePath);
        if (!isIgnored) {
          const stats = await stat(fullPath);
          const indentation: string = "  ".repeat(depth);
          if (stats.isDirectory()) {
            folderStructure += `${indentation}- ${item}/\n`;
            folderStructure += await getFolderStructure(fullPath, depth + 1);
          } else {
            folderStructure += `${indentation}- ${item}\n`;
          }
        }
      }
      return folderStructure;
    };

    // Start from the current working directory
    const folderStructure: string = `# Folder Structure\n\n${await getFolderStructure(process.cwd(), 0)}`;

    return folderStructure;
  } catch (error) {
    console.error("Error generating folder structure from Git:", error);
    return "";
  }
}
function constructPrompt(
	readme: string,
	commits: string,
	diff: string,
	folderStructure: string,
) {
	let prompt = "Generate a commit message based on the following: Keep the commit message concise and clear. Use the present tense. Use the imperative mood. Limit the first line to 50 characters or less. The first line should be a summary of the commit. The rest of the commit message should be a description of the changes made in the commit. \n\n";

	if (readme) {
		prompt += `README:\n${readme}\n\n`;
	}

	if (commits) {
		prompt += `Commit History:\n${commits}\n\n`;
	}

	if (diff) {
		prompt += `Diff:\n${diff}\n\n`;
	}

	if (folderStructure) {
		prompt += `Folder Structure:\n${folderStructure}\n\n`;
	}

	console.log("Prompt constructed");
	return prompt;
}

export const generatePrompt = (
  readme: string,
  commits: string,
  folderStructure: string,
) =>
	[
		`Here is some information about how to write a commit message: \n${readme}`,
    // `Here is the commit history:\n${commits}`,
    // `Here is the folder structure:\n${folderStructure}`,
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    // `Given the above information, write a concise git commit message for the following code diff: given by the user`
	]
		.filter(Boolean)
		.join('\n');

async function makeApiCall(messages: { role: string; content: string }[]) {
	try {
		console.log("Making API call to Llama-2-7B-Chat-GGUF model");
		console.log("Prompt:", messages);

		const response = await fetch("http://localhost:7001/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "SanctumAI/Meta-Llama-3-8B-Instruct-GGUF",
				messages,
				temperature: 0,
				max_tokens: 100,
			}),
		});
		const data = await response.json();
		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error("Error making API call:", error);
		return null;
	}
}
