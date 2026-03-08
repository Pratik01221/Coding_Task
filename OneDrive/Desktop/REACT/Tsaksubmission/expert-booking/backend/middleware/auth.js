const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer '))
    return res.status(401).json({ error: 'Not authorized' });

  const token = hdr.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token invalid/expired' });
  }
};