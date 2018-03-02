const express = require('express');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await readAll();
  res.json(rows);
});

router.post('/', async (req, res) => {
  const rows = await readAll();
  const { title = '' } = req.body;
  const { text = '' } = req.body;
  const { datetime = '' } = req.body;

  if (title.length === 0) {
    return res.status(400).json({
      field: 'title',
      error: 'Titill má ekki vera tómur',
    });
  }

  if (text.length == null) {
    return res.render(400).json({
      field: 'title',
      error: 'Texti má ekki vera tómur',
    });
  }

  if (datetime.length === 0) {
    return res.status(400).json({
      field: 'title',
      error: 'Dagsetning ekki á réttu formi!',
    });
  }

  const nextId = await rows.map(i => i.id).reduce((a, b) => (a > b ? a : b + 1), 1);

  const item = {
    id: nextId, title, text, datetime,
  };

  create(item);
  return res.status(201).json(item);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = await readOne(id);
  if (id === undefined) {
    res.status(400).json({
      error: 'not found',
    });
  }
  res.json(note);
});

router.put('/:id', async (req, res) => {
  const { title = '' } = req.body;
  const { text = '' } = req.body;
  const { datetime = '' } = req.body;

  const id = parseInt(req.params.id, 10);

  if (title.length === 0) {
    return res.status(400).json({
      field: 'title',
      error: 'Titill má ekki vera tómur',
    });
  }

  if (text.length == null) {
    return res.render(400).json({
      field: 'title',
      error: 'Texti má ekki vera tómur',
    });
  }

  if (datetime.length === 0) {
    return res.status(400).json({
      field: 'title',
      error: 'Dagsetning ekki á réttu formi!',
    });
  }

  const item = { title, text, datetime };
  const note = await update(id, item);
  return res.status(201).json(note);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (readOne(id)) {
    await del(id);
    return res.status(200).send('Tókst að eyða!');
  }
  return res.send('bla');
});

module.exports = router;
