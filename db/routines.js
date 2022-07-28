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
      SELECT *
      FROM routines
      )
       ;
    `);
    console.log(rows);
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
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
       ;
    `);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error('Error getting all activities!');
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
    console.error('Error getting all activities!');
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
    console.error('Error getting all activities!');
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
    console.error('Error getting all activities!');
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
    console.error('Error getting all activities!');
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
     UPDATE routines
     SET ${setString}
     WHERE id=${id}
     RETURNING *;
   `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error('Error updating Routine!');
    throw error;
  }
}

async function destroyRoutine(id) {
  await client.query(
    `
    DELETE FROM routine_activities
    WHERE "routineId"=${id}
    `
  );
  await client.query(
    `
    DELETE FROM routines
    WHERE id=${id}
    `
  );
}

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
