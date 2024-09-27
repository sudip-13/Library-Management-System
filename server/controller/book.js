const Book = require("../model/book");


const addBook = async (req, res) => {
  try {
    const { bookName, authorName, quantity } = req.body;


    if (!bookName) {
      return res.status(400).json({ error: "Book name is required." });
    }

    const newBook = new Book({
      bookName,
      authorName,
      quantity: quantity !== undefined ? quantity : 1,
    });


    await newBook.save();

    res
      .status(201)
      .json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the book." });
  }
};

const updateBook = async (req, res) => {

  const { bookName, authorName, quantity } = req.body;
  const serialNumber = req.params.serialNumber;

  try {
    const book = await Book.findOneAndUpdate(
      { serialNumber },
      { bookName, authorName, quantity },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json({ message: "Book updated successfully!", book });

  } catch (error) {
    res.status(500).json({ error: "Failed to update the book." });
  }

}


const findBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    const response = books.map((book) => ({
      serialNumber: book.serialNumber,
      bookName: book.bookName,
      authorName: book.authorName || "Not provided",
      availableQuantity: book.quantity > 0 ? "Y" : "N",
      quantity: book.quantity
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve books." });
  }
};



module.exports = {
  addBook,
  findBooks,
  updateBook
};
