"use client"

import React, { useState, useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ManageBooks() {
    const [isAddingBooks, setIsAddingBooks] = useState(true);
    const [bookName, setBookName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    const fetchBooks = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5051/book/bookdetails`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.error("Expected an array but received:", data);
                setBooks([]);
            }
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleBookSelection = (e) => {
        const book = books.find((b) => b.serialNumber === e.target.value);
        setSelectedBook(book);
        if (book) {
            setBookName(book.bookName);
            setAuthorName(book.authorName);
            setQuantity(book.quantity);
        } else {
            setBookName("");
            setAuthorName("");
            setQuantity("");
        }
    };

    const handleSubmit = async () => {
        const method = isAddingBooks ? "POST" : "PUT";
        const url = isAddingBooks ? `http://localhost:5051/book/add` : `http://localhost:5051/book/update/${selectedBook.serialNumber}`;

        const payload = {
            bookName,
            authorName,
            quantity: parseInt(quantity, 10),
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success(isAddingBooks ? "Book added successfully!" : "Book updated successfully!");
                fetchBooks();
                resetForm();
            } else {
                toast.error("Failed to perform the action.");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("An error occurred.");
        }
    };

    const resetForm = () => {
        setBookName("");
        setAuthorName("");
        setQuantity("");
        setSelectedBook(null);
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {isAddingBooks ? "Add Book" : "Update Book"}
                    </h1>
                    {!isAddingBooks && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Select Book
                            </label>
                            <select
                                className="w-full border-gray-300 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedBook ? selectedBook.serialNumber : ""}
                                onChange={handleBookSelection}
                            >
                                <option value="">-- Select a book --</option>
                                {books.map((book) => (
                                    <option key={book.serialNumber} value={book.serialNumber}>
                                        {book.serialNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Book Name</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Book Name"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                        />

                        <label className="block text-gray-700 font-medium mb-2">Author Name</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Author Name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />

                        <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full border-gray-300 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <button
                            className={`w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300`}
                            onClick={handleSubmit}
                        >
                            {isAddingBooks ? "Add Book" : "Update Book"}
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                                setIsAddingBooks(!isAddingBooks);
                                resetForm();
                            }}
                        >
                            {isAddingBooks ? "Already have a Book? Update here" : "Want to add a new Book?"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
