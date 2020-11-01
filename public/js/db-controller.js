const idbPromised = idb.open('saved_teams_database', 1, upgradedDb => {
    if (!upgradedDb.objectStoreNames.contains('teams')) {
        upgradedDb.createObjectStore("teams", {keyPath: "idTeam"});
    }
});

const dbGetAllTeam = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", `readonly`);
            return transaction.objectStore("teams").getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Favorite not Found"))
            }
        })
    })
};

const dbGetTeam = team => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", `readonly`);
            return transaction.objectStore("teams").get(team);
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Favorite not Found"))
            }
        })
    })
};

const dbsaveTeam = team => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", `readwrite`);
            transaction.objectStore("teams").add(team);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};

const dbRemoveTeam = idTeam => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("teams", `readwrite`);
            transaction.objectStore("teams").delete(idTeam);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};
