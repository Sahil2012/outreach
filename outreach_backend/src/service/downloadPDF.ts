import axios from 'axios';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PDF_PATH = join(__dirname, "../resume.pdf");


async function downloadPDF(url : string) : Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  writeFileSync(PDF_PATH, response.data);

  return PDF_PATH;
}

export default downloadPDF;
