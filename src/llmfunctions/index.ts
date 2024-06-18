import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import PROMPT_KNOWLEDGE_BASED from "./comments";
import readReadmeFile from "../folderFunctions/readReadme";
import { getStagedChangesDiff, generateFolderStructureFromGit } from "../folderFunctions/gitUtils";
const ollama = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3", // Default value
});

const parser = new StringOutputParser();


const KNOWLEDGE_PROMPT = `Here is the consolidated information from the Reddit thread on conducting a code review, formatted as a comprehensive guide:
${PROMPT_KNOWLEDGE_BASED}
`;


const PROMPT_V1 = 
  `
You are a code reviewer. You are tasked with reviewing a codebase and providing feedback on its quality, maintainability, and adherence to coding standards.

### Instructions:
1. **Folder Structure:** The hierarchical structure of files and directories within the repository.
3. **README File:** The contents of the README file, providing context about the project's purpose and key functionalities.

### Context:
**Folder Structure:**
\`\`\`
{folderStructure}
\`\`\`

**README File:**
\`\`\`
{readme}
\`\`\``;

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    KNOWLEDGE_PROMPT
  ],
  [
    "system",
    PROMPT_V1
  ],
  ["human", `Here is the diff of changes made to the repository:\n{diff}`],
]);


const generatePrompt = async (readme:string, folderStructure:string) => {
  const partialPrompt = await prompt.partial({
    folderStructure,
    readme
  });
  return partialPrompt;
};

export const runPrompt = async (readme:string, folderStructure:string,diff: string) => {
  const partialPrompt = await generatePrompt(
    readme,
    folderStructure
  )
  const chain = partialPrompt.pipe(ollama).pipe(parser);
  const response = await chain.invoke({ diff });
  return response;
};

async function generateReviewMessage(branch:string) {
	try {
		const readme = await readReadmeFile();
		const diff = await getStagedChangesDiff(branch);
		const folderStructure = await generateFolderStructureFromGit();

		const response = await runPrompt(readme, folderStructure, diff);

		console.log("Generated Message:\n\n", response);
	} catch (error) {
		console.error("Error generating message:", error);
	}
}
export default generateReviewMessage;