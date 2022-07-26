const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { 
      rows
    } = await client.query (
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT ("creatorId", "isPublic") DO NOTHING 
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    console.log("THIS IS THE CREATE ROUTINE: ", rows)
    return rows;
  } catch (error) {
    console.error('Error creating routine!');
    throw error;
  }
}



async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {}

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
