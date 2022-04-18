const router = require('express').Router();

const withAuth = require('../../utils/auth');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
const userRoutes = require('./user-routes');

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/tags', tagRoutes);

module.exports = router;