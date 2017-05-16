if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}
//const fs = require('fs');
//const uuid = require('uuid/v4');
//const moment = require('moment');

function list(userId = '') {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, userId);
}

function create(userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans) {
    const sql = `
        INSERT INTO events ("userId", "location", "lng", "lat", "startTs", "endTs", "startYear", "startMonth", "startDay", "endYear", "endMonth", "endDay", "allDay", "title", "decription", "lable", "trans")
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        EXTRACT(YEAR FROM TIMESTAMP $5),
        EXTRACT(MONTH FROM TIMESTAMP $5),
        EXTRACT(DAY FROM TIMESTAMP $5),
        EXTRACT(YEAR FROM TIMESTAMP $6),
        EXTRACT(MONTH FROM TIMESTAMP $6),
        EXTRACT(DAY FROM TIMESTAMP $6),
        $7,
        $8,
        $9,
        $10,
        $11
        RETURNING *
    `;
    return db.one(sql, [userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans]);
}

function accesstoken() {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse('{"token": "pk.eyJ1IjoidHJrdWFuIiwiYSI6ImNqMXlsYnE1ZjAwdHcyeHJxa3lrYWg2dHcifQ.tBkscd-d-S0Z374VcVw3Qg"}'));
  });
}

function modify(eventId, userID, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans) {
    const sql = `
        UPDATE events
        SET "location" = $3,
        "lng" = $4,
        "lat" = $5,
        "startTs" = $6,
        "endTs" = $7,
        "startYear" = EXTRACT(YEAR FROM TIMESTAMP $6),
        "startMonth" = EXTRACT(MONTH FROM TIMESTAMP $6),
        "startDay" = EXTRACT(DAY FROM TIMESTAMP $6),
        "endYear" = EXTRACT(YEAR FROM TIMESTAMP $7),
        "endMONTH" = EXTRACT(MONTH FROM TIMESTAMP $7),
        "endDay" = EXTRACT(DAY FROM TIMESTAMP $7),
        "allDay" = $8,
        "title" = $9,
        "decription" = $10,
        "lable" = $11,
        "trans" = $12
        WHERE "eventId" = $1
        AND "userID" = $2
        RETURNING *
    `;
    return db.one(sql, [eventId, userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans]);
}

function day(userId, year, month, day) {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        AND "startYear" = $2
        AND "startMonth" = $3
        AND "startDay" = $4
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, [userId, year, month, day]);
}

function month(userId, year, month) {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        AND "startYear" = $2
        AND "startMonth" = $3
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, [userId, year, month]);
}

function next(userId) {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        AND "startTs" > now()
        ORDER BY "startTs" ASC
    `;
    let tmp = {};
    try{
      tmp = db.one(sql, userId);
    }catch(err){

    }
    return tmp;
}

module.exports = {
    list,
    create,
    accesstoken,
    modify,
    month,
    day,
    next
};
