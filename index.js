import { MongoClient } from 'mongodb';

// Replace the uri string with your connection string.
const uri =
  'mongodb+srv://user1:vKwiJaOBgmoOP7XI@cluster0.xmvqwng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('Store');
    const products = database.collection('products');

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const productList = await products.find(query).toArray();

    const productListWithStringIds = productList.map((product) => {
      return { ...product, _id: product._id.toString() };
    });

    console.log(productListWithStringIds);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
