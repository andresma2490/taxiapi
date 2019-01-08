//Settings
const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');
const cors = require('cors');

//Settings
Router.use(cors());

Router.post('/api/profile', async (req, res) => {
  const {id_serial} = req.body;
  const myquery = {
    text: 'SELECT first_name, last_name, phone FROM client WHERE id_serial=$1',
    values: [id_serial]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows[0]);
    })
    .catch(err => {

    })
});

Router.post('/api/profile/favorites', async (req, res) => {
  const {id_serial} = req.body;
  const myquery = {

    text: 'SELECT favid, title, (select ST_AsGeoJSON(coor)::json) as geom FROM client NATURAL JOIN favorites where id_serial = $1',
    values: [id_serial]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows);
    })
    .catch(err => {

    })
});

Router.post('/api/profile/new-favorite', async (req, res) => {
  const {f_item, phone, id_serial} = req.body;
  const myquery = {
    text: 'INSERT INTO favorites (phone, title, coor) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 3725))',
    values: [phone, f_item.title, f_item.coor[0], f_item.coor[1]]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Inserted favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/profile/delete-favorite', async (req, res) => {
  const {fav, id_serial} = req.body;
  const myquery = {
    text: 'DELETE FROM favorites WHERE favid=$1',
    values: [fav]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Deleted favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/profile/update-favorite', async (req, res) => {
  const {fav, id_serial, newTitle} = req.body;
  const myquery = {
    text: 'UPDATE favorites SET title=$1 WHERE favid=$2',
    values: [newTitle, fav]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Updated favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

module.exports = Router;
