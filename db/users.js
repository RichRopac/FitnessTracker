const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  // EXTRA CREDIT
  const SALT_COUNT = 10;
  password = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, username;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    console.error("Error creating user!");
    throw error;
  }
}

async function getUser({ username, password }) {
  const tempUser = await getUserByUsername(username);
  const hashedPassword = tempUser.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    console.log("THIS IS USER:::::: ", tempUser);
    let user = { id: tempUser.id, username: tempUser.username };
    return user;
  } else {
    console.log("Error getting user!");
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username
    FROM users
    WHERE id=${userId};
  `
    );
    return user;
  } catch (error) {
    console.error("Error getting user by id!");
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
    console.error("Error getting userByUsername!");
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
