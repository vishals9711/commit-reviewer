import fs  from "node:fs";
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
export default readReadmeFile;  