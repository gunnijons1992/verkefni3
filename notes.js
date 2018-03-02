/* todo sækja pakka sem vantar  */
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/notes';
/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  const query = 'INSERT INTO notes (title, text, datetime) VALUES ($1, $2, $3)';
  const values = [title, text, datetime];
  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Villa við að setja inn gögn!');
    throw err;
  } finally {
    await client.end;
  }
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM notes');
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Villa við að sækja gögn!');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query('SELECT * FROM notes WHERE id=' + id);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Villa að velja gögn');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const values = [title, text, datetime];
    await client.query('UPDATE notes SET title = $1, text = $2, datetime = $3 WHERE id =' + id, values);
    const item = await readOne(id);
    return item;
  } catch (e) {
    console.error('Villa að uppfæra gögn');
    throw e;
  } finally {
    await client.end();
  }
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query('DELETE FROM notes WHERE id = ' + id);// eslint-disable-line
    return 'jeeei';
  } catch (err) {
    console.error('Error deleting data');
    throw err;
  } finally {
    await client.end();
  }
}


module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
