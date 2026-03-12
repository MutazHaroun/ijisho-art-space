const pool =require("../db");

// const {hashPassword} = require('../utils/hashPassword')
// POST /api/users/register
// const { HashPassowrd: hashPassword } = require("../utils/hashPassword");
const HashPassowrd = require("../utils/hashPassword");
 async function registerController(req, res){
    const {name, email} = req.body;
    const defaultPass = "123456"


    const hashedPassword = await HashPassowrd(defaultPass);

    const sql = "INSERT INTO users (names, email, password,role) VALUES( $2, $3, $4, $5)";
    pool.query(sql, [ name, email, hashedPassword, 'user'], (err, result)=>{
    console.log("Received registration data:", { name, email, hashedPassword });
        if (err) {
            throw err;
            // res.status(500).json({message: "Failed to save the user data"})
        } else {
            res.status(200).json({message: "User Saved successfully"})
        }
    })
}

module.exports = registerController;