var Sequelize = require("sequelize");
var fs = require("fs");
var db;
const dev = true;

var User;
var Project;
var Tag;
var Flashcard;
var Link;

function read_credentials() {
    return new Promise((resolve, reject) => {
        fs.readFile("db_credentials.json", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

function set_up_db(db_credentials) {
    db_data = JSON.parse(db_credentials);
    username = db_data.username;
    password = db_data.password;
    host = db_data.host;
    db_name = db_data.db_name;
    return new Promise((resolve, reject) => {
        db = new Sequelize(db_name, username, password, {
            host: host,
            dialect: "mysql"
        });
        resolve(db);
    });
}

function test_connection(db) {
    return new Promise((resolve, reject) => {
        db.authenticate()
            .then(() => {
                console.log("Established database connection");
                resolve(db);
            }).catch((err) => {
                console.error("Error in database connection: ", err);
                reject(err);
            });
    });
}

function define_model(db) {
    // define user
    User = db.define("user", {
        username: {type: Sequelize.STRING, primaryKey: true},
        password: Sequelize.STRING
    });

    // define project
    Project = db.define("project", {
        project_id: {type: Sequelize.STRING, primaryKey: true},
        project_name: Sequelize.STRING,
        playlist_id: Sequelize.STRING,
        username: {
            type: Sequelize.STRING,
            references: {
                model: User,
                key: "username"
            }
        }
    });

    // define tag
    Tag = db.define("tag", {
        tag_id: {type: Sequelize.STRING, primaryKey: true},
        tag_name: Sequelize.STRING,
        project_id: {
            type: Sequelize.STRING,
            references: {
                model: Project,
                key: "project_id"
            }
        }
    });

    // define flashcard
    Flashcard = db.define("flashcard", {
        flashcard_id: {type: Sequelize.STRING, primaryKey: true},
        flashcard_title: Sequelize.TEXT,
        flashcard_content: Sequelize.TEXT
    });

    // define link
    Link = db.define("link", {});
    Flashcard.belongsToMany(Tag, {through: Link});
    Tag.belongsToMany(Flashcard, {through: Link});

    user_promise = new Promise((resolve, reject) => {
        User.sync({force:dev}).then(() => {
            resolve(User);
        });
    });

    project_promise = new Promise((resolve, reject) => {
        Project.sync({force:dev}).then(() => {
            resolve();
        });
    });

    tag_promise = new Promise((resolve, reject) => {
        Tag.sync({force:dev}).then(() => {
            resolve();
        });
    });
    
    link_promise = new Promise((resolve, reject) => {
        Link.sync({force:dev}).then(() => {
            resolve();
        });
    });
    
    flashcard_promise = new Promise((resolve, reject) => {
        Flashcard.sync({force:dev}).then(() => {
            resolve();
        });
    });

    return user_promise
        .then(project_promise)
        .then(tag_promise)
        .then(flashcard_promise)
        .then(link_promise);
}

read_credentials()
    .then(set_up_db, console.error)
    .then(test_connection, console.error)
    .then(define_model, console.error);

exports.getAllProjects = function(username) {
    Project.findAll().then
}

exports.getProject = function(pid) {
}

exports.getAllTags = function(pid) {
}

exports.getTag = function(pid, tid) {
}

exports.getFlashcardsByTag = function(pid, tid) {
}

exports.getFlashcard = function(pid, fid) {
}

exports.makeProject = function(pid, name) {
}

exports.makeTag = function(pid, tid, name) {
}

exports.makeFlashcard = function(pid, fid, title, content) {
}

exports.linkFlashcardToTag = function(tid, fid) {
}

exports.linkProjectToPlaylist = function(pid, playlist_id) {
}