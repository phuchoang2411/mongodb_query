import http from 'http';
import url from 'url';
import { MongoClient } from 'mongodb';
import { handleProductsRoute, handleProductRoute } from './routes.js';

// Replace the uri string with your connection string.
const uri =
  'mongodb+srv://user1:vKwiJaOBgmoOP7XI@cluster0.xmvqwng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  console.log(req.method, pathname);

  switch (pathname) {
    case '/products':
      await handleProductsRoute(req, res, client);
      break;
    case '/product':
      await handleProductRoute(req, res, query, client);
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      break;
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
