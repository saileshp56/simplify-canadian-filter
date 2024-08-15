import {fetchReadme, removeBoilerplate, serializeTableToArrays} from "./utils.js"

const owner = 'SimplifyJobs';
const repo = 'Summer2025-Internships';

fetchReadme(owner, repo)

const filePath = "./unsanitized_readme.txt"
const startLine = '(DO NOT CHANGE THIS LINE)';
const endLine = '(DO NOT CHANGE THIS LINE)';
const outputFilePath = "readme_without_boilerplate.txt"
removeBoilerplate(filePath, startLine, endLine, outputFilePath)

serializeTableToArrays(outputFilePath)
