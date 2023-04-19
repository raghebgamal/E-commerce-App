const jwt = require("jsonwebtoken");


const createToken = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED
    });
    user.tokens.push(token);
    await user.save({ validateBeforeSave: false });
    return token;
};

module.exports = createToken;