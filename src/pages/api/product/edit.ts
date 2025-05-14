import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
import slugify from 'slugify';
import Product from 'src/models/product';


// _mock
import db from '../../../utils/db';
// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    db.connectDB();

    const {
      _id,
      name,
      description,
      category,
      rating,
      numReviews,
      discount,
      sold,
      isPublic,
      images,
      price,
      quantity,
      subDescription
    } = req.body;

    if (!_id) {
      db.disconnectDB();
      return res.status(400).json({ message: 'Missing product ID (_id)' });
    }

    await Product.updateMany({ price: { $exists: false } }, { $set: { price: 0 } });
    await Product.updateMany({ quantity: { $exists: false } }, { $set: { quantity: 0 } });

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          description,
          category,
          rating,
          numReviews,
          discount,
          sold,
          isPublic,
          images,
          price,
          slug: slugify(name),
          quantity,
          subDescription
        },
      },
      { new: true }
    );

    db.disconnectDB();

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      product: updatedProduct,
    });
  } catch (error) {
    console.error('[Update product API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
