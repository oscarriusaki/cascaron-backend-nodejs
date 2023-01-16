const bcryptjs = require('bcryptjs');
const { db } = require('../database/config');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req, res) => {
    const {email, pas} = req.body;
    const pg = await db;
    const sql = 'select * from users where email = $1 and estado = $2';
    try{
        pg.query(sql, [ email, true], async (err, result)=> {
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
                    const passwordVerify = bcryptjs.compareSync(pas, result.rows[0].pas);
                    const token = await generarJWT(email);
                    req.user = result.rows[0];
                    req.user.tokens = token
                    if(passwordVerify){
                        return res.status(200).json({
                            msg: 'logged successfully',
                            token,
                            user:req.user,
                        })
                    }else{
                        
                        return res.status(404).json({
                            msg: 'password incorrect'
                        })
                    }
                }else{
                    return res.status(404).json({
                        msg: 'email not found'
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
        return res.status(403).json({
            msg: 'there was during the login'
        })
    }
}

const validarToken = async(req, res) => {
    
    return res.json(
        req.user,
    )

}

module.exports = {
    login,
    validarToken,
}