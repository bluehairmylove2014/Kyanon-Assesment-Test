
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');
const path = require('path');

// Get the absolute path of the database file
const databasePath = path.resolve(__dirname, '../db/accounts.json');
exports.login = function (req, res, next) {
    try {
        const email = req.body.email;
        const psw = req.body.password;

        let rawdata;
        try {
            rawdata = fs.readFileSync(databasePath);
        }
        catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
        
        let jsondata = JSON.parse(rawdata);
        let isValid = false;
        jsondata.forEach(account => {
            if(account.email === email && account.password === psw) {
                // Valid login
                const jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
                    algorithm: 'RS256',
                    // Add to set expire time  
                    expiresIn: 120,
                    subject: account.id
                })
                res.status(200).json({ idToken: jwtBearerToken, expiresIn: 120 });
                isValid = true;
                return;
            }
        })
        !isValid && res.status(200).json("invalid");
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
