const router = require('express').Router();
const { Product, Tag, User } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/loggedin', (req, res) => {
    User.findOne({
        where: {
            id: req.session.user_id
        },
        attributes: {exclude: ['password']},
        include: [
            {
                model: Tag
            },
            {
                model: Product
            }
        ]
    })
    .then(data => {
        res.json(data)
    })
})
// Get one user
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Product,
            },
            {
                model: Tag
            }
    ],
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// Create User
router.post('/signup', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        monthly_income: req.body.monthly_income
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user with that username' });
                return;
            }

            const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password' });
                return;
            }

            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({
                    message: 'You are now logged in'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})


router.post('/logout', withAuth, (req, res) => {
    req.session.destroy(() => {
        res.status(204).end();
    });
})

// Update User
router.put('/:id', (req, res) => {
    User.update(req.body, {

        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })

        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with that Id.' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;