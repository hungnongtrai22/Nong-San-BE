
import { NextApiRequest, NextApiResponse } from 'next';

// utils
import cors from 'src/utils/cors';
// _mock
import { _users, JWT_SECRET, JWT_EXPIRES_IN } from 'src/_mock/_auth';
import Product from 'src/models/product';
import slugify from 'slugify';
import db from '../../../utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { name, description, category, rating, numReviews, discount, sold, isPublic, images, price, quantity, subDescription } =
      req.body;

    db.connectDB();

    const test = await Product.findOne({ name });
    if (test) {
      return res.status(400).json({ message: 'Product already exist, Try a different name' });
    }

    const newProduct = await new Product({
      name,
      description,
      slug: slugify(name),
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
    }).save();

    db.disconnectDB();

    return res.status(200).json({
      product: newProduct,
    });
  } catch (error) {
    console.error('[Auth API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
