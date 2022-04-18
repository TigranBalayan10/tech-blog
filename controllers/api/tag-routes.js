const router = require('express').Router();
const { Product, Tag, User } = require('../../models');
const sequelize = require('sequelize');

// Get all routes
router.get('/', (req, res) => {
    Tag.findAll({
        include: [
            {
                model: Product,
                include: [{
                    model: User,
                    attributes: { exclude: ['password']}
                }]
            },
    ],
    })
        .then(dbTagData => res.json(dbTagData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }
        );
});

// Trying to get one tags and their price total
router.get('/total/:tag_id/:user_id', (req, res) => {
    Tag.findOne({
        where: {
            id: req.params.tag_id
        },
        raw: true,
        include: [
            {
                model: Product,
                where: {
                    user_id: req.params.user_id
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('price')), 'total_price']]
                },
            ]
        })
    .then(dbProductData => {
        res.json(dbProductData);
    })
    .catch(err => res.json(err))
})

// Create a new tag
router.post('/', (req, res) => {
    Tag.create({
        tag_name: req.body.tag_name,
        tag_color: req.body.tag_color,
        user_id: req.session.user_id

    })
        .then(dbTagData => res.json(dbTagData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete Tag
router.delete('/:id', (req, res) => {
    Tag.destroy({
        where: {
            id: req.params.id
        }
        
    })
    .then(dbTagData => {
    if (!dbTagData) {
        res.status(404).json({ message: 'No tag found with that ID'});
        return;
    }
    res.json(dbTagData);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json(err)
    });
});

// Update tag
router.put('/:id', (req, res) => {
    Tag.update(req.body,{
        
        where: {
            id: req.params.id
        }
    })
    
    .then(dbTagData => {
        if (!dbTagData) {
            res.status(404).json({ message: 'No tag found with this id' });
            return;
        }
        res.json(dbTagData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;