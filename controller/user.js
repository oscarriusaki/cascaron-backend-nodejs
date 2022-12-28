const { response } = require("express");
const { db } = require("../database/config");

const getUsers = async (req, res = response) => {
    const pg = await db;
    
}
const getUser = (req, res = response) => {
    res.json({
        msg: 'getUser '
    })
}
const postUser = (req, res = response) => {
    res.json({
        msg: 'postUser'
    })
}
const putUser = (req, res = response) => {
    res.json({
        msg: 'putUsers'
    })
}
const deleteUser = (req, res = response) => {
    res.json({
        msg: 'deleteUs'
    })
}

module.exports = {
    getUsers,
    getUser ,
    postUser,
    putUser,
    deleteUser
}