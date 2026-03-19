import { createServer } from 'node:http';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { existsSync } from 'node:fs';

const PORT = 3456;
// 项目根目录 = little_tool/doc-writer/../../
const PROJECT_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, data) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function handleWrite(req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const { filePath, content } = body;
  if (!filePath || content == null) {
    return json(res, 400, { error: '缺少 filePath 或 content' });
  }

  // 安全检查：不允许路径逃逸
  const absPath = resolve(PROJECT_ROOT, filePath);
  if (!absPath.startsWith(PROJECT_ROOT)) {
    return json(res, 403, { error: '路径不合法' });
  }

  await mkdir(dirname(absPath), { recursive: true });
  await writeFile(absPath, content, 'utf-8');
  json(res, 200, { ok: true, wrote: filePath });
}

async function handleRead(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const filePath = url.searchParams.get('path');
  if (!filePath) return json(res, 400, { error: '缺少 path 参数' });

  const absPath = resolve(PROJECT_ROOT, filePath);
  if (!absPath.startsWith(PROJECT_ROOT)) {
    return json(res, 403, { error: '路径不合法' });
  }
  if (!existsSync(absPath)) {
    return json(res, 404, { error: '文件不存在' });
  }

  const content = await readFile(absPath, 'utf-8');
  json(res, 200, { content });
}

async function serveHTML(res) {
  const html = await readFile(join(dirname(new URL(import.meta.url).pathname), 'index.html'), 'utf-8');
  cors(res);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (req.method === 'GET' && url.pathname === '/') return serveHTML(res);
    if (req.method === 'GET' && url.pathname === '/api/read') return handleRead(req, res);
    if (req.method === 'POST' && url.pathname === '/api/write') return handleWrite(req, res);
    json(res, 404, { error: 'Not found' });
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`📝 Doc Writer 运行中: http://localhost:${PORT}`);
  console.log(`📁 项目根目录: ${PROJECT_ROOT}`);
});
