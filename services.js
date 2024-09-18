import { ObjectId } from 'mongodb';

export const getProducts = async (client) => {
  try {
    await client.connect();
    const database = client.db('Store');
    const products = database.collection('products');

    // Query for all documents
    const query = {};
    const productList = await products.find(query).toArray();

    // Convert ObjectId to string
    return productList.map((product) => {
      return { ...product, _id: product._id.toString() };
    });
  } catch (error) {
    console.error('Error: ', error);
  } finally {
    await client.close();
  }
};

export const getProductById = async (id, client) => {
  try {
    await client.connect();
    const database = client.db('Store');
    const products = database.collection('products');

    // Convert string ID to ObjectId
    const objectId = ObjectId.createFromHexString(id);

    // Query for a document by ID
    const product = await products.findOne({ _id: objectId });

    // Convert ObjectId to string
    return { ...product, _id: product._id.toString() };
  } catch (error) {
    console.error('Error: ', error);
  } finally {
    await client.close();
  }
};
