const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets');
let db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/images`);

module.exports.getImages = (() => {
    return db.query(`SELECT * FROM images`);
});

module.exports.addImage = ((url, name, title, description) => {
    return db.query(
        `INSERT INTO images (url, name, title, description)
    VALUES ($1, $2, $3, $4) returning *`,
        [url, name, title, description]);
});
module.exports.getImageById = (imageid) => {
    return db.query(
        `SELECT * FROM images
        WHERE id = $1`,[imageid]
    );
};
module.exports.addComment = (comment, username, image_id) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3) RETURNING *`, [comment, username, image_id]
    );
};
module.exports.getComments = (imageid) => {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1`,[imageid]
    );
};
