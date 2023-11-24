const jwt = require('jsonwebtoken')

const createAccessToken  = (_id, role) => jwt.sign({_id, role}, process.env.JWT_SECRET, {expiresIn: '3d'})
const createRefreshToken  = (_id) => jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '7d'})

module.exports = {
    createAccessToken,
    createRefreshToken
}