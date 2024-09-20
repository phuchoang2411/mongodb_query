import http from 'http';
import url from 'url';
import { MongoClient } from 'mongodb';
import { handleProductsRoute, handleProductRoute } from './routes.js';
import dotenv from 'dotenv';

// Replace the uri string with your connection string.

// Load environment variables from .env file
dotenv.config();

// Use the environment variable for the MongoDB URI
const uri = process.env.MONGODB_URI;

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

  try {
    await client.connect();

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
  } catch (error) {
    console.error('Error: ', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
