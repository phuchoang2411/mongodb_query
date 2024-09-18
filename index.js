import { MongoClient } from 'mongodb';
import http from 'http';

// Replace the uri string with your connection string.
const uri =
  'mongodb+srv://user1:vKwiJaOBgmoOP7XI@cluster0.xmvqwng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

const getProducts = async () => {
  try {
    await client.connect();

    const database = client.db('Store');
    const products = database.collection('products');

    // Query for all documents
    const query = {};
    const productList = await products.find(query).toArray();

    // Convert ObjectId to string
    console.log(
      'Product List: ',
      productList.map((product) => {
        return { ...product, _id: product._id.toString() };
      })
    );
    return productList.map((product) => {
      return { ...product, _id: product._id.toString() };
    });
  } catch (error) {
    console.error('Error: ', error);
  } finally {
    await client.close();
  }
};

const server = http.createServer(async (req, res) => {
  console.log('Request URL: ', req.url);
  switch (req.url) {
    case '/products':
      switch (req.method) {
        case 'GET':
          try {
            const products = await getProducts();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
          break;
        default:
          res.writeHead(405, { 'Content-Type': 'text/plain' });
          res.end('Method Not Allowed');
          break;
      }
      break;
    case '/another-route':
      switch (req.method) {
        case 'GET':
          // Handle another route
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('This is another route');
          break;
        default:
          res.writeHead(405, { 'Content-Type': 'text/plain' });
          res.end('Method Not Allowed');
          break;
      }
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
