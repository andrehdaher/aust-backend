const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function encode64(data) {
  const map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
  let res = '';
  for (let i = 0; i < data.length; i += 3) {
    const b1 = data[i];
    const b2 = (i + 1) < data.length ? data[i + 1] : 0;
    const b3 = (i + 2) < data.length ? data[i + 2] : 0;
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3F;
    res += map[c1] + map[c2] + map[c3] + map[c4];
  }
  return res;
}

function plantumlEncode(text) {
  const deflated = zlib.deflateRawSync(Buffer.from(text, 'utf8'));
  return encode64(deflated);
}

async function fetchAndSave(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buffer));
  console.log('Saved', outPath);
}

(async () => {
  try {
    const diagramsDir = path.resolve(__dirname);
    const files = ['erd.puml', 'usecase.puml'];
    for (const f of files) {
      const p = path.join(diagramsDir, f);
      if (!fs.existsSync(p)) {
        console.warn('Missing', p);
        continue;
      }
      const text = fs.readFileSync(p, 'utf8');
      const code = plantumlEncode(text);
      const pngUrl = `https://www.plantuml.com/plantuml/png/${code}`;
      const svgUrl = `https://www.plantuml.com/plantuml/svg/${code}`;
      await fetchAndSave(pngUrl, path.join(diagramsDir, f.replace('.puml', '.png')));
      await fetchAndSave(svgUrl, path.join(diagramsDir, f.replace('.puml', '.svg')));
    }
    console.log('All done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
