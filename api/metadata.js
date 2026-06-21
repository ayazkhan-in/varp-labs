import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  const urlPath = req.url || '';
  
  try {
    // Read the compiled index.html generated at build time
    const filePath = path.join(__dirname, '../dist/index.html');
    let html = fs.readFileSync(filePath, 'utf8');

    // Dynamically retrieve protocol and host to support Vercel preview deploys
    const host = req.headers.host || 'varplabs.com';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;
 
    let title = 'Varp Labs | Sophisticated Software';
    let description = 'Building sophisticated software solutions for the modern world. We transform complex requirements into elegant, high-performance digital products.';
    let ogImage = `${baseUrl}/og.png`;
    let url = `${baseUrl}/`;

    if (urlPath.includes('/sweep')) {
      title = 'Sweep | Auto Screenshot Deletion';
      description = 'Sweep intelligently monitors your Android device storage and automatically deletes screenshots based on age, size, and custom rules.';
      ogImage = `${baseUrl}/og-sweep.png`;
      url = `${baseUrl}/sweep`;
    } else if (urlPath.includes('/qrlog') || urlPath.includes('/qr-log')) {
      title = 'QRLog | QR Code Scanner & Generator';
      description = 'QRLog is a minimal, privacy-focused Android scanner built for security. It archives every scan locally and blocks malicious redirect links.';
      ogImage = `${baseUrl}/og-qrlog.png`;
      url = `${baseUrl}/qrlog`;
    } else if (urlPath.includes('/teachback')) {
      title = 'TeachBack | Explain to Learn';
      description = 'TeachBack is an AI-powered learning app built around the Feynman Technique. Explain concepts aloud, receive clarity feedback, and review with spaced repetition.';
      ogImage = `${baseUrl}/og-teachback.png`;
      url = `${baseUrl}/teachback`;
    }

    // Replace default index.html tags with page-specific ones for SEO crawlers
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<link id="canonical-link" rel="canonical" href=".*?"/g, `<link id="canonical-link" rel="canonical" href="${url}"`)
      .replace(/<meta name="description" content=".*?"/g, `<meta name="description" content="${description}"`)
      .replace(/<meta property="og:title" content=".*?"/g, `<meta property="og:title" content="${title}"`)
      .replace(/<meta property="og:description" content=".*?"/g, `<meta property="og:description" content="${description}"`)
      .replace(/<meta property="og:image" content=".*?"/g, `<meta property="og:image" content="${ogImage}"`)
      .replace(/<meta property="og:url" content=".*?"/g, `<meta property="og:url" content="${url}"`)
      .replace(/<meta name="twitter:title" content=".*?"/g, `<meta name="twitter:title" content="${title}"`)
      .replace(/<meta name="twitter:description" content=".*?"/g, `<meta name="twitter:description" content="${description}"`)
      .replace(/<meta name="twitter:image" content=".*?"/g, `<meta name="twitter:image" content="${ogImage}"`)
      .replace(/<meta name="twitter:url" content=".*?"/g, `<meta name="twitter:url" content="${url}"`);

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error in metadata pre-renderer:', error);
    return res.status(500).send('Internal Server Error: Failed to render metadata');
  }
}
