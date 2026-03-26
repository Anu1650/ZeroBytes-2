import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized.' });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode && tokenDecode.id) {
      req.userId = tokenDecode.id;
      return next();
    }

    return res.json({ success: false, message: 'Not Authorized. Login again' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;