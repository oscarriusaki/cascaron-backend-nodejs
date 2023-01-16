const jwt = require('jsonwebtoken')

const generarJWT = (email = '') => {
    return new Promise((resolve, reject) => {
        const payload = {email};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '999s'
        },(err, token) => {
            if(err){
                console.log(err);
                reject('token no generate');
            }else{
                resolve(token)
            }
        })
        
    })
}

module.exports = {
    generarJWT,
}