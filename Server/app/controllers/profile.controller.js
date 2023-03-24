
const fs = require('fs');
const path = require('path');

// Get the absolute path of the database file
const databasePath = path.resolve(__dirname, '../db/accounts.json');

exports.getData = function(req, res, next) {
    try {
        const userid = req.query.user_id;
        let rawdata;
        try {
            rawdata = fs.readFileSync(databasePath);
        }
        catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
        
        let jsondata = JSON.parse(rawdata);
        let isExist = false;
        jsondata.forEach(account => {
            if(account.id === userid) {
                res.status(200).json(account);
                isExist = true;
                return;
            }
        })
        !isExist && res.status(200).json(null);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
exports.setData = function(req, res, next) {
    try {
        const user_data = req.body.newUserData;
        let rawdata;
        try {
            rawdata = fs.readFileSync(databasePath);
        }
        catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
        
        let jsondata = JSON.parse(rawdata);
        let isExist = false;
        jsondata = jsondata.map(account => {
            if(account.id === user_data.id) {
                // Change to new data
                account = user_data;
                isExist = true;
            }
            return account;
        })
        // Send fail response to client
        if(isExist) {
            // Update database
            console.log('sending...');
            fs.writeFileSync(databasePath, JSON.stringify(jsondata));
            // Send success response to client
            res.status(200).json({status: true, msg: ''});
        }
        else {
            res.status(200).json({status: false, msg: 'Cannot find account'});
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}