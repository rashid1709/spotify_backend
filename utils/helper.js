const jwt = require('jsonwebtoken');
exports= {}

exports.getToken= async (email,user) =>{
    //assume this code is complete
    const token = jwt.sign({identifire:user._id},"ThisKeyWillBeSecret");
    return token;
}

module.exports = exports;