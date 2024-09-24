import {
  getProducts,
  getProductById,
  deleteProductById,
  addProduct,
  updateProductById,
} from './services.js';

export const handleProductsRoute = async (req, res, client) => {
  switch (req.method) {
    case 'GET':
      try {
        const products = await getProducts(client);
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
};

export const handleProductRoute = async (req, res, query, client) => {
  switch (req.method) {
    case 'GET':
      if (query.id) {
        try {
          const product = await getProductById(query.id, client);
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
    case 'DELETE':
      if (query.id) {
        try {
          const result = await deleteProductById(query.id, client);
          if (result.success) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(result.message);
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
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const productData = JSON.parse(body);
          const result = await addProduct(productData, client);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Bad Request: Invalid JSON');
        }
      });
      break;
    case 'PUT':
      if (query.id) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const productData = JSON.parse(body);
            const result = await updateProductById(
              query.id,
              productData,
              client
            );
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
            } else {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end(result.message);
            }
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Invalid JSON');
          }
        });
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
};
