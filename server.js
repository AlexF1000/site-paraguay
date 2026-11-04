/**
 * PARAGUAI PRIME - SERVIDOR LOCAL ZERO-DEPENDENCY
 * Executa em qualquer máquina com Node.js sem precisar de "npm install".
 * 
 * Para rodar:
 *   node server.js
 * 
 * Depois acesse no seu navegador:
 *   http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  const filePath = path.join(__dirname, reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Página Não Encontrada</h1><p><a href="/">Voltar para o Início</a></p>');
      } else {
        res.writeHead(500);
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  🇵🇾 PARAGUAI PRIME - PORTAL INICIADO COM SUCESSO!`);
  console.log(`  🌐 Acesse no seu navegador: http://localhost:${PORT}`);
  console.log(`====================================================`);
  
  // Abre o navegador automaticamente no Windows
  exec(`start http://localhost:${PORT}`);
});
