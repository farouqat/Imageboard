const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets');
let db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/images`);

module.exports.getImages = (() => {
    return db.query(`SELECT * FROM images`);
});
