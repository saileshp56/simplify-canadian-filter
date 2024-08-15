import axios from 'axios';
import fs from 'fs';
import path from 'path';

const REPEATED_COMPANY_TOKEN = "↳"
const DIR = './temp_files';

export async function fetchReadme(owner: string, repo: string): Promise<void> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    
    const filePath = path.join(DIR, 'unsanitized_readme.txt');

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
    }

    fs.writeFile(filePath, response.data, (err) => {
      if (err) {
        console.error('Error writing to file:', err.message);
      }
    });
  } catch (error) {
    console.error('Error fetching the README file:', error.message);
  }
}

// fetchReadme(owner, repo);


export function removeBoilerplate(filePath: string, startLine: string, endLine: string, outputFilePath: string) {
  fs.readFile(`./${DIR}/${filePath}`, 'utf-8', (err, data: string) => {
    if (err) {
      console.error('Error reading the file:', err.message);
      return;
    }

    const lines = data.split('\n');
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(startLine)) {
        startIndex = i + 1;
        break;
      }
    }

    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].includes(endLine)) {
        endIndex = i;
        break;
      }
    }

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {

      // the + 1 is to avoid an empty line after the startLine
      // the -1 is to avoid an empty line after the endLine
      const extractedContent = lines.slice(startIndex + 1, endIndex - 1).join('\n');

      const dir = path.dirname(`./${DIR}/${outputFilePath}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFile(`./${DIR}/${outputFilePath}`, extractedContent, (err) => {
        if (err) {
          console.error('Error writing to file:', err.message);
        }
      });
    } else {
      console.log('Could not find the specified lines in the file.');
    }
  });
}

export function serializeTableToArrays(filePath: string) {
  const outputFilePath = './output_md_files/filtered_lines.md';

  const outputDir = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.readFile(`./${DIR}/${filePath}`, 'utf-8', (err, data: string) => {
    if (err) {
      console.error('Error reading the file:', err.message);
      return;
    }

    const lines = data.split('\n');
    let include: boolean = true;
    let filteredContent = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.includes(REPEATED_COMPANY_TOKEN)) {
        if (include) {
          filteredContent += line + '\n';
        }
        continue;
      }

      if (line.includes("🛂") || line.includes("🇺🇸") || line.includes("🔒")) {
        include = false;
      } else {
        include = true;
      }

      if (include) {
        filteredContent += line + '\n';
      }
    }

    fs.writeFile(outputFilePath, filteredContent, (err) => {
      if (err) {
        console.error('Error writing to file:', err.message);
      } else {
        console.log(`Filtered content saved to ${outputFilePath}`);
      }
    });
  });
}