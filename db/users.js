/* eslint-disable no-useless-catch */
const e = require('cors');
const client = require('./client');

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    console.log('creating user...');
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING username, id;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    console.log('get user ....');
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1 AND password=$2;
  `,
      [username, password]
    );

    return user;
  } catch (error) {
    console.log('getUser completed ...');
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1;
  `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1;
  `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
