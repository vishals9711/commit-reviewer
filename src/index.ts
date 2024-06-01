import fs from "node:fs";
import { Command } from "commander";
import cowsay from "cowsay";
import { Configuration, OpenAIApi } from "openai";
import simpleGit from "simple-git";

const program = new Command();
const git = simpleGit();

console.log(
  cowsay.say({
    text: "Commit Message Generator",
  })
);

program
  .version("1.0.0")
  .description("CLI tool for generating commit messages")
  .option("-g, --generate", "Generate a commit message")
  .parse(process.argv);

const options = program.opts();
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

    // Construct the prompt
    const prompt = constructPrompt(readme, commits, diff);

    // Make API call to Llama-2-7B-Chat-GGUF model
    const response = await makeApiCall(prompt);

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
    const commits = log.all.map((commit) => commit.message).join("\n");
    console.log("Commit history retrieved");
    return commits;
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

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
function constructPrompt(readme: string | void, commits: string, diff: string) {
  let prompt = "Generate a commit message based on the following:\n\n";
  
  if (readme) {
    prompt += `README:\n${readme}\n\n`;
  }

  if (commits) {
    prompt += `Commit History:\n${commits}\n\n`;
  }

  if (diff) {
    prompt += `Diff:\n${diff}\n\n`;
  }

  console.log("Prompt constructed");
  return prompt;
}

async function makeApiCall(prompt: string) {
  try {
    console.log("Making API call to Llama-2-7B-Chat-GGUF model");
    console.log("Prompt:", prompt);
    const response = await fetch("http://localhost:7001/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "TheBloke/Llama-2-7B-Chat-GGUF",
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: -1,
        // stream: true,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
}