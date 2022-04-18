const router = require('express').Router();
const sequelize = require('../config/connection');
const { Tag, Product, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Tag.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [{
            model: Product
        },
        {
            model: User,
            attributes: { exclude: ['password']}
        }]
    })
        .then(dbProductData => {
            let Products = [];
            const Tags = dbProductData.map(product => product.get({ plain: true }));
            const allProducts = Tags.map(product => product.products)
            const nestedProducts = allProducts.map(product => {
                if (product) {
                    return product
                }
            })
            for (let i = 0; i < nestedProducts.length; i++){
                for(let j = 0; j < nestedProducts[i].length; j++){
                    Products.push(nestedProducts[i][j])
                }
            }
            Products = Products.reverse();
            Products = Products.slice(0, 5);
            res.render('dashboard', {
                Products,
                Tags,
                loggedIn: true,
                username: req.session.username
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
})

// Edit a product
router.put('/edit/:id', withAuth, (req, res) => {
    Product.findByPk(req.params.id, {
        attributes: ['product_name', 'price', 'tag_id'],
        include: [{
            model: Tag,
            attributes: ['tag_name', 'tag_color']
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
        .then(dbProductData => {
            const product = dbProductData.get({ plain: true });
            res.render('edit-expense', {
                product,
                loggedIn: true,
                username: req.session.username
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
})

module.exports = router;