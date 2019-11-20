const jwt = require('jsonwebtoken');
const findUser = require('../model/user/findUser');
const {validationResult} = require('express-validator');
require('dotenv/config');

module.exports = async (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password,
    }
    try {
        // Input invalid
        const err = await validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const userData = await findUser(user);
        if (userData) {
            delete user['password'];
            user._id = userData[0]._id
            const token = jwt.sign(user, process.env.jwtSecret, {expiresIn: '24h'});
            return res.status(200).json({
                success: true,
                message: 'Login success',
                token: token,
                userData: userData[0]
            });
        } else {
            return res.json({
                success: false,
                message: 'invalid email or password'
            });
        }
    } catch (err) {
        res.json({message: err});
    }
}