import { readdir, readFile, stat } from "fs/promises";
import ignore, { type Ignore } from "ignore";
import path from "node:path";
import simpleGit from "simple-git";

const git = simpleGit();

const getCommitHistory= async () => {
	try {
		const log = await git.log();
		const commits = log.all.map((commit, index) => {
			return {
				index: index + 1,
				message: commit.message,
			};
		});
		// console.log("Commits retrieved :: ", JSON.stringify(commits));
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
		ig.add(".git");

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

export { generateFolderStructureFromGit, getCommitHistory, getStagedChangesDiff };
