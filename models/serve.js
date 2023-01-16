const express = require('express');
const cors = require('cors');
const { db } = require('../database/config');
const bodyParse = require('body-parser')

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            user: '/user',
            login: '/login',
            hero: '/hero',
            err: '/'
        }
        // database 
        this.database();
        // middlewares
        this.middleware();
        // router
        this.router();
    }
    async database(){
        const pg = await db;
        try{
            pg.connect((err, client, release) => {
                if(err){
                    return console.error(err.stack)
                }
                console.log('connect')
            })
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    middleware(){
        // allow routes cors
        this.app.use(cors());
        // recive date type json
        this.app.use(express.json()); 
        // file public
        this.app.use(express.static('public'));
        // esto permite poner los datos recibidos por el backend y ponerlos en el body a disposicion de usarlos
        // this.app.use(bodyParse.urlencoded({extended:true}))
    }
    router(){
        this.app.use(this.path.user, require('../router/user'));
        this.app.use(this.path.login, require('../router/login'));
        this.app.use(this.path.hero, require('../router/hero'));
        this.app.use(this.path.err, require('../router/err'));
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('connected');
        });
    }
}
module.exports = Server;