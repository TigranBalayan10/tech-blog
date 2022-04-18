const router = require('express').Router();
const { Product, Tag, User } = require('../../models');
const { sequelize } = require('../../models/Product');

// Get all products, tags, and users
router.get('/', (req, res) => {
    Product.findAll({
        include: [
            {
                model: Tag,
                attributes: {exclude: ['updateAt']}
            },
            {
                model: User,
                attributes: {exclude: ['password']}
            }
        ],
        attributes: {exclude: ['updateAt']}
    })
        .then(dbProductData => {
            const products = dbProductData.map(product => product.get({ plain: true }));
            return res.status(200).json(products);
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
})

// Find total $ in products in a given Tag
router.get('/total/:tag_id/:user_id', (req, res) => {
    Product.findAll({
        where: {
            tag_id: req.params.tag_id,
            user_id: req.params.user_id
        },
        attributes: [
            [sequelize.fn('sum', sequelize.col('price')), 'total_price']
        ]
    })
    .then(dbProductData => {
        res.json(dbProductData);
    })
    .catch(err => res.json(err))
})

// Find one product 
router.get('/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Tag
            },
            {
                model: User
            }
    ]
    })
        .then(dbProductData => {
            if (!dbProductData) {
                res.status(404).json({ message: 'No product found with this id' });
                return;
            }
            res.json(dbProductData);
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
})

// Create a new product
router.post('/', (req, res) => {
    Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        user_id: req.body.user_id,
        tag_id: req.body.tag_id,
        monthly_bill: req.body.monthly_bill
    })
        .then(dbProductData => res.json(dbProductData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

// Update 
router.put('/:id', (req, res) => {
    Product.update(req.body,{ 
        where: {
            id: req.params.id
        }
    })
    .then(dbProductData => {
        if(!dbProductData) {
            res.status(400).json({ message: 'No product with that id found'})
        }
        res.json(dbProductData);
    })
    .catch(err => {
        console.log(err); 
        res.status(500).json(err);
    })
})

// Delete Product
router.delete('/:id', (req, res) => {
    Product.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbProductData => {
            if (!dbProductData) {
                res.status(404).json({ message: 'No product found with this id' });
                return;
            }
            res.json(dbProductData);
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
});

// Get all products in current Month:
router.get('/monthly/:id', (req, res) => {
    Product.findAll({
        where: {
            user_id: req.params.id
        }
    })
    .then((products) => {
        res.json(products)
    })
    .catch(err => {
        console.log(err);
        res.json(err)
    })
});

module.exports = router;