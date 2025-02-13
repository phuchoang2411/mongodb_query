import { ObjectId } from 'mongodb';

export const getProducts = async (client, page = 1, limit = 10) => {
  try {
    const database = client.db('Store');
    const products = database.collection('products');

    // Query for all documents
    const query = {};
    const skip = (page - 1) * limit;
    const productList = await products
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Convert ObjectId to string
    return productList.map((product) => {
      return { ...product, _id: product._id.toString() };
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const getProductById = async (id, client) => {
  try {
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
  }
};

export const deleteProductById = async (id, client) => {
  try {
    const database = client.db('Store');
    const products = database.collection('products');

    // Convert string ID to ObjectId
    const objectId = ObjectId.createFromHexString(id);

    // Delete the document by ID
    const result = await products.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      return { success: true, message: 'Product deleted successfully' };
    } else {
      return { success: false, message: 'Product not found' };
    }
  } catch (error) {
    console.error('Error: ', error);
    return { success: false, message: 'An error occurred' };
  }
};

export const addProduct = async (productData, client) => {
  try {
    const database = client.db('Store');
    const products = database.collection('products');

    // Insert the new product
    const result = await products.insertOne(productData);

    if (result.acknowledged) {
      return {
        success: true,
        message: 'Product added successfully',
        productId: result.insertedId.toString(),
      };
    } else {
      return { success: false, message: 'Failed to add product' };
    }
  } catch (error) {
    console.error('Error: ', error);
    return { success: false, message: 'An error occurred' };
  }
};

export const updateProductById = async (id, productData, client) => {
  try {
    const database = client.db('Store');
    const products = database.collection('products');

    // Convert string ID to ObjectId
    const objectId = ObjectId.createFromHexString(id);

    // Update the document by ID
    const result = await products.updateOne(
      { _id: objectId },
      { $set: productData }
    );

    if (result.matchedCount === 1) {
      return { success: true, message: 'Product updated successfully' };
    } else {
      return { success: false, message: 'Product not found' };
    }
  } catch (error) {
    console.error('Error: ', error);
    return { success: false, message: 'An error occurred' };
  }
};
