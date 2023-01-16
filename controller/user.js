const { response } = require("express");
const { db } = require("../database/config");
const { generarJWT } = require("../helpers/generarJWT");
const bcryptjs = require('bcryptjs');

const getUsers = async (req, res = response) => {
    const pg = await db;
    const sql = 'select * from users where estado = $1 order by id_user desc';
    pg.query(sql, [ true], (err, result) => {
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
            if(result.rowCount >= 0){
                return res.status(200).json(result.rows)
            }else{      
                return res.status(404).json({
                    msg: 'no hero found it with'
                })
            }
        }
    })
}
const getUser = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from users where id_user = $1 and estado = $2'
    pg.query(sql, [id, true], (err, result) => {
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
            if(result.rowCount === 1) {
                return res.status(200).json(result.rows[0])
            }else{
                return res.status(404).json({
                    msg: `user not found with the id ${id}`
                })
            }
        }
    })
}
const postUser = async (req, res = response) => {
    const pg = await db;
    const { first_name, email, pas } = req.body;
    const sql = 'select * from users where email = $1';
    const sql2 = 'insert into users(first_name, email, pas, fecha, tokens, estado) values ($1,$2,$3,$4,$5,$6)';
    try{
        pg.query(sql, [ email], async (err, result) => {
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
                if(result.rowCount === 0){
                    const yy = new Date().getFullYear();
                    const mm = new Date().getMonth()+1;
                    const dd = new Date().getDate();
                    const token = await generarJWT(email);
                    const salt = bcryptjs.genSaltSync();
                    const password = bcryptjs.hashSync(pas, salt)

                    pg.query(sql2, [ first_name, email, password, (yy+'/'+mm+'/'+dd), token, true] , (err, result) => {
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
                                const sql3 = 'select * from users where email = $1 and estado = $2';
                                pg.query(sql3, [email, true], (err, result)=> {
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
                                        if(result.rowCount == 1){
                                            req.user = result.rows[0];
                                            return res.status(200).json({
                                                msg: 'successfully registered',
                                                token,
                                                user: req.user
                                            });
                                        }else{
                                            return res.status(404).json({
                                                msg: 'there was an error'
                                            })
                                        }
                                    }
                                })
                            }else{
                                // return res.status(400).json({
                                return res.json({
                                    msg: "can't be registered"
                                })
                            }
                        }
                    })
                }else{
                    // return res.status(404).json({
                    return res.json({
                        msg: 'email already exist'
                    })
                }
            }
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: 'there was an error, please talk to the administrator'
        })
    }
}
const putUser = async (req, res = response) => {
    try{

        const pg = await db;
        const {id_user, ...resto} = req.body;
        const email_user_logged = req.user.email;
        const sql = 'select * from users where email = $1';
        const sql2 = 'update users set first_name = $1, email= $2, pas= $3, fecha= $4, tokens= $5, estado= $6 where email = $7 and estado = $8';
        pg.query(sql, [resto.email], async (err, result) => {
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
                if( result.rowCount === 0 ||(result.rowCount === 1 && result.rows[0].email === email_user_logged) ){
                    
                    const yy = new Date().getFullYear();
                    const mm = new Date().getMonth() + 1;
                    const dd = new Date().getDate();
                    const token = await generarJWT(resto.email);
                    const salt = bcryptjs.genSaltSync();
                    const newPas = bcryptjs.hashSync(resto.pas, salt);

                    pg.query(sql2, [resto.first_name, resto.email, newPas, (yy+'/'+mm+'/'+dd), token, true, email_user_logged, true] , (err, result) => {
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
                                req.user.first_name = resto.first_name;
                                req.user.email = resto.emal;
                                req.user.pas = newPas;
                                req.user.fecha =  (yy+"/"+mm+"/"+dd);
                                req.user.tokens = token;

                                console.log(req.user);
                                return res.status(200).json({
                                    msg: 'successfully updated'
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was an erro during the query'
                                })
                            }
                        }
                    })
                }else{
                    return res.status(400).json({
                        msg: 'error the email already exist'
                    })
                }
            }
        })
    
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error during the registration'
        });
    }
}
const deleteUser = async (req, res = response) => {
    const pg = await db;
    const email = req.user.email;
    sql = 'select * from users where email = $1 and estado = $2'
    sql2 = 'update users set estado = $1 where email = $2 and estado = $3';
    pg.query(sql, [email, true], (err, result) => {
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
                pg.query(sql2, [false, email, true], (err, result) => {
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
                            return res.status(200).json({
                                msg: 'successfully eliminated'
                            })
                        }else{
                            return res.status(500).json({
                                msg: 'there was an erro during the elimintation'
                            })
                        }
                    }
                })
            }else{
                return res.status(404).json({
                    msg: 'user not found or eliminated'
                })
            }
        }
    })
}
module.exports = {
    getUsers,
    getUser ,
    postUser,
    putUser,
    deleteUser
}