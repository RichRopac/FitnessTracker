const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.error('Error creating routine!');
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=${id}`
    );
    return routine;
  } catch (error) {
    console.error('Error getting routineById!');
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(`
      SELECT 
      FROM 
      WHERE NOT EXISTS
        SELECT
        FROM
        WHERE
      )
       ;
    `);
    return rows;
  } catch (error) {
    console.error('Error getting all routinesWithoutActivities!');
    throw error;
  }
}

async function getAllRoutines() {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM routines
      JOIN
       ;
    `);

    return rows;
  } catch (error) {
    console.error('Error getting all activites!');
    throw error;
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
