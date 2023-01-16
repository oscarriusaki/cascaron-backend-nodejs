const { json, response } = require("express");
const { db } = require("../database/config");
const path = require("path");

const getHeros = async (req, res) => {
    const pg = await db;
    const sql = 'select * from hero where estado = $1 order by id_hero desc';
    pg.query(sql, [true], (err, result) => {
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
            if(result.rowCount >= 1){
                return res.status(200).json(result.rows);
            }else{
                return res.status(404).json({
                    msg: 'hero not found'
                })
            }
        }
    })
}
const getHero = async (req, res) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where id_hero = $1 and estado = $2 ';
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
            if(result.rowCount === 1){
                return res.status(200).json(result.rows[0]);
            }else{
                return res.status(404).json({
                    msg: `hero not found with the id ${id}`
                })
            }
        }
    })
}
const postHero = async (req, res) => {
    console.log(req.file)
    const pg = await db;
    const id_user_logged = req.user.id_user; 
    const {idd, superhero, publisher, alter_ego, first_appearance, characterss } = req.body;
    const sql = 'insert into hero (id_user, idd, superhero, publisher, alter_ego, first_appearance, characterss, originalname, image, pathimage, estado) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
    
    pg.query(sql, [id_user_logged, idd, superhero, publisher, alter_ego, first_appearance, characterss, req.file.originalname, req.file.filename, `http://localhost:8080/hero/img/${req.file.filename}`, true], (err, result) => {
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
                return res.status(200).json({
                    msg: 'successfully registered'
                });
            }else{
                return res.status(400).json({
                    msg: 'there was an error during the registration'
                })
            }
        }
    })

}
const getImage = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where image = $1 and estado = $2';

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
            if(result.rowCount === 1){
                return res.sendFile(path.join( __dirname, `../images/${id}`));
            }else{
                return res.status(404).json({
                    msg: `sorry there's not img found`
                })
            }
        }
    })
}
const putHero = async (req, res) => {
    const pg = await db;    
    const { id } = req.params;
    const id_user_logged = req.user.id_user+'';
    const { idd, superhero, publisher, alter_ego, first_appearance, characterss, originalname, image, pathimage } = req.body;
    const sql = 'update hero set id_user = $1, idd = $2, superhero = $3, publisher = $4, alter_ego = $5, first_appearance = $6, characterss = $7, originalname = $8, image = $9, pathimage = $10 where id_hero = $11 and estado = $12 and id_user = $13';
    pg.query(sql, [id_user_logged, idd, superhero, publisher, alter_ego, first_appearance, characterss, originalname, image, pathimage, id, true, id_user_logged], (err, result) => {
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
                return res.status(500).json({
                    msg: 'successfully updated'
                })
            }else{
                return res.status(400).json({
                    msg: `No hero with ${id}`
                })
            }
        }
    })
}
const deleteHero = async (req, res) => {
    const pg = await db;
    const { id } = req.params;
    const id_user = req.user.id_user;
    const sql = 'update hero set estado = $1 where id_hero = $2 and estado = $3 and id_user = $4';
    pg.query(sql, [false, id, true, id_user], (err, result) => {        
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
                    msg: `no hero found with the id ${id}`
                })
            }       
        }
    })  
}
const getHeroByPublisher = async ( req , res) => {
    const { id } = req.params;
    const sql = 'select * from hero where publisher ILIKE $1 and estado = $2';
    const pg = await db;

    pg.query(sql, ["%"+id+"%", true], (err, result) => {
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
            if(result.rowCount >= 1){
                return res.status(200).json(result.rows);
            }else{
                return res.status(404).json({
                    msg: 'No hero found'
                })
            }
        }
    });   
}
const getHeroById = async (req, res) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where id_hero = $1 and estado = $2';

    pg.query(sql, [id, true], (err, result) => {
        if(err){
            return res.status(500).json({
                code: err.code, 
                name: err.name, 
                detail: err.detail,
                hint: err.hint,
                where: err.where,
                file: err.file,
            });                    
        }else{
            if(result.rowCount >= 0){
                return res.status(200).json(result.rows[0])
            }else{
                return res.status(404).json({
                    msg: 'no hero found'
                })
            }
        }
    })
}
const getHeroByName = async (req, res) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where superhero like $1 and estado = $2';

    pg.query(sql, ['%'+id+'%', true], (err, result) => {
        if(err){
            return res.status(500).json({
                code: err.code, 
                name: err.name, 
                detail: err.detail,
                hint: err.hint,
                where: err.where,
                file: err.file,
            });                    
        }else{
            console.log(result.rowCount);
            if(result.rowCount >= 1){
                return res.status(200).json(result.rows)
            }else{
                return res.status(404).json({
                    msg: 'hero not found'
                })
            }
        }
    })
}

module.exports = {
    getHeros,
    getHero,
    postHero,
    getImage,
    putHero,
    deleteHero,
    getHeroByPublisher,
    getHeroById,
    getHeroByName
}