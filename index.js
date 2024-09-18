import { MongoClient, ObjectId } from 'mongodb';
import http from 'http';
import url from 'url';

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

const getProductById = async (id) => {
  try {
    await client.connect();
    const database = client.db('Store');
    const products = database.collection('products');

    // Query for a document by ID
    const product = await products.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    // Convert ObjectId to string
    return { ...product, _id: product._id.toString() };
  } catch (error) {
    console.error('Error: ', error);
  } finally {
    await client.close();
  }
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  console.log(req.method, pathname);
  switch (pathname) {
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
    case '/product':
      switch (req.method) {
        case 'GET':
          if (query.id) {
            try {
              const product = await getProductById(query.id);
              if (product) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(product));
              } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Product Not Found');
              }
            } catch (error) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            }
          } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing Product ID');
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
