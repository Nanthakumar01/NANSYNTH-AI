const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {

        console.log("EMAIL:", req.body.email);
        console.log("PASSWORD:", req.body.password);

        const user = await User.findOne({ email: req.body.email });

        console.log("USER FOUND:", !!user);

        if (user) {
            const match = await user.comparePassword(req.body.password);
            console.log("PASSWORD MATCH:", match);

            if (!match) {
                return res.status(401).send({
                    error: 'Invalid login credentials'
                });
            }
        } else {
            return res.status(401).send({
                error: 'Invalid login credentials'
            });
        }

        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET
        );

        res.send({ user, token });

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Get Profile
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
