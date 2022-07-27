const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  duration,
  count,
}) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId",
          "activityId",
          duration,
          count
          ) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT ("activityId", "routineId") DO NOTHING
        RETURNING *;
      `,
      [routineId, activityId, duration, count]
    );

    //console.log('THIS IS THE ROUTINE TO RETURN: ', routine);
    return routine;
  } catch (error) {
    console.error('Error adding an activity to routine!');
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities 
      WHERE id=${id}`
    );
    return routine;
  } catch (error) {
    console.error('Error getting routineById!');
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routine_activities 
      WHERE "routineId"=${id}`
    );
    return rows;
  } catch (error) {
    console.error('Error getting routineById!');
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
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
     UPDATE routine_activities
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

async function destroyRoutineActivity(id) {
  const {
    rows: [routine],
  } = await client.query(
    `
  DELETE FROM routine_activities
  WHERE id=$1
  RETURNING id;
  `,
    [id]
  );
  return routine;
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
