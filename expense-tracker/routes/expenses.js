const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/', (req, res) => {
  Expense.find()
    .then(expenses => {
      res.render('expenses/index', { expenses });
    })
    .catch(err => res.status(500).send(err.message));
});

router.get('/create', (req, res) => {
  res.render('expenses/create');
});

router.post('/create', (req, res) => {
  const { amount, category, notes } = req.body;
  const newExpense = new Expense({ amount, category, notes });

  newExpense.save()
    .then(() => res.redirect('/expenses'))
    .catch(err => res.status(500).send(err.message));
});

router.post('/delete/:id', (req, res) => {
  Expense.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/expenses'))
    .catch(err => res.status(500).send(err.message));
});

module.exports = router;
