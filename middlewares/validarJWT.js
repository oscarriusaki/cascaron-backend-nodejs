const { request } = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../database/config');

const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(404).json({
            msg: 'no token provider'
        })
    }

    try{

        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const sql = 'SELECT * FROM users where email = $1 and estado = $2';
        const pg = await db;
        pg.query(sql, [ email, true] , (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file,
                });         
            }else{
                if(result.rowCount === 1){
                    req.user = result.rows[0];
                    next()
                }else{
                    return res.status(400).json({
                        msg: `no user found with email ${email}`
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
        // return res.status(500).json({
        return res.json({
            msg: 'token invalid o expired'
        })
    }
}
module.exports = {
    validarJWT
}