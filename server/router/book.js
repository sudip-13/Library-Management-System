const express = require('express');
const router = express.Router();
const { addBook,findBooks,updateBook } = require('../controller/book');


router.post('/add', addBook);
router.put('/update/:serialNumber', updateBook);

router.get('/bookdetails', findBooks);


module.exports = router;
