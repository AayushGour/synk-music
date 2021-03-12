const MongoClient = require("mongodb").MongoClient;
var constants = require("./constants.js")

const findByPartyAndHostNames = (partyName, hostName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(constants.mongoURL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db(constants.dbName);
            try {
                dbo
                    .collection("user_data")
                    .findOne(
                        { partyName: partyName, hostName: hostName },
                        (err, result) => {
                            if (err) reject(err);
                            db.close();
                            resolve(result);
                        }
                    );
            } catch (error) {
                console.error(error);
                reject(error)
            }
        });
    })
};

const findByPartyName = (partyName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(constants.mongoURL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db(constants.dbName);
            try {
                dbo
                    .collection(constants.collectionName)
                    .findOne({ partyName: partyName }, (err, result) => {
                        if (err) reject(err);
                        db.close();
                        resolve(result)
                    });
            } catch (error) {
                db.close();
                console.error(error);
                reject(error)
            }
        });
    })
};

const writeUserData = (userData) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(constants.mongoURL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db(constants.dbName);
            try {
                dbo.collection("user_data").insertOne(userData, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                    db.close();
                })
            } catch (error) {
                db.close();
                console.error(error);
                reject(error)
            }
        })
    })
}

const updateData = (field, data, queryData) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(constants.mongoURL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db(constants.dbName);
            var query = { partyName: queryData };
            var newValues = { $set: { [field]: data } }
            try {
                dbo.collection(constants.collectionName).updateOne(query, newValues, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                    db.close();
                })
            } catch (error) {
                db.close();
                console.error(error);
                reject(error)
            }
        })
    })
}
const deleteParty = (partyName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(constants.mongoURL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db(constants.dbName);
            var query = { partyName: partyName }
            try {
                dbo.collection(constants.collectionName).deleteOne(query, (result) => {
                    if (err) reject(err);
                    resolve(result);
                    db.close();
                })
            } catch (error) {
                db.close();
                console.error(error);
                reject(error)
            }
        });
    })
}

module.exports = {
    findByPartyAndHostNames,
    findByPartyName,
    writeUserData,
    updateData,
    deleteParty
};
