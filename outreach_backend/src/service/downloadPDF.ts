import axios from 'axios';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function downloadPDF(url : string) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  writeFileSync(join(__dirname,'../resume.pdf'), response.data);
}

export default downloadPDF;
