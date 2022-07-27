const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

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
    console.error("Error creating routine!");
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
    console.error("Error getting routineById!");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routines
      )
       ;
    `);
    console.log(rows);
    return rows;
  } catch (error) {
    console.error("Error getting all routinesWithoutActivities!");
    throw error;
  }
}

async function getAllRoutines() {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
       ;
    `);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all activites!");
    throw error;
  }
}

async function getAllPublicRoutines() {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON routines."creatorId" = users.id AND routines."isPublic" = true
       ;
    `);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all activites!");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  // select and return an array of all routines
  try {
    const { rows } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" 
        FROM routines
        JOIN users ON routines."creatorId" = users.id AND users.username = $1;
      `,
      [username]
    );

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all activites!");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" 
        FROM routines
        JOIN users ON routines."creatorId" = users.id AND users.username = $1 AND routines."isPublic" = true;
      `,
      [username]
    );

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all activites!");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      WHERE routine_activities."activityId" = $1 AND routines."isPublic" = true;
    `,
      [id]
    );
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all activites!");
    throw error;
  }
}

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
