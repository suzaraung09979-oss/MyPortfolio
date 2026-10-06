const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key';

const verifyToken = (req, res, next) => {
  // Request header ထဲက Authorization ကို ယူခြင်း
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  // "Bearer <token>" ပုံစံဖြစ်므로 Token သီးသန့်ခွဲထုတ်ခြင်း
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. Invalid token format.' });
  }

  try {
    // Token မှန်ကန်မှုရှိမရှိ စစ်ဆေးခြင်း
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified; // Admin အချက်အလက်များကို Request ထဲ ထည့်ပေးလိုက်ခြင်း
    next(); // အားလုံးမှန်ကန်လျှင် သက်ဆိုင်ရာ API ဆက်သွားခွင့်ပြုသည်
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;