import { Ollama } from "@langchain/community/llms/ollama";

const ollama = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "llama3", // Default value
  });
  

  async function runPrompt(prompt: {
    role: string;
    content: string;
}[]) {
    const response = await ollama.generate(prompt.map((p) => p.content));
    console.log(response)
    return "response.generations"
}

export const generatePrompt = (readme:string, commits:string, folderStructure:string) => {
  return `
You are an AI specialized in writing Git commit messages. You will receive information about the folder structure, commit history, and README file of a repository. Based on this information, you will generate concise and descriptive commit messages.

### Instructions:
1. **Folder Structure:** The hierarchical structure of files and directories within the repository.
2. **Commit History:** A list of previous commit messages, including their contents and timestamps.
3. **README File:** The contents of the README file, providing context about the project's purpose and key functionalities.

### Rules:
- In each subsequent interaction, you will receive a diff of changes made to the repository.
- Your task is to generate an appropriate commit message based on the provided diff and the initial context (folder structure, commit history, README file).
- The response should be a single commit message, concise and relevant to the changes made.

### Context:
**Folder Structure:**
\`\`\`
${folderStructure}
\`\`\`

**Commit History:**
\`\`\`
${commits}
\`\`\`

**README File:**
\`\`\`
${readme}
\`\`\`
  Only return the commit message and nothing else.`
};




    export const generatePromptMessages = (prompt: string,diff: string) => {
      const messages = [{
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: `${diff}`,
      },]
    return messages;
  };
export default runPrompt