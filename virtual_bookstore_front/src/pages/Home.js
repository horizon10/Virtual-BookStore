import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const Home = ({ addToCart }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [books, setBooks] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
            setUserId(user.id);
        } else {
            console.error("Kullanıcı ID'si bulunamadı");
        }

        axios.get('http://localhost:5000/api/books')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error("Kitapları alırken hata oluştu: ", error);
            });
    }, []);

    const filteredBooks = books.filter(
        (book) =>
            (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory ? book.category === selectedCategory : true)
    );

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Kitap arayın..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tüm Kategoriler</option>
                        <option value="Epik">Epik</option>
                        <option value="Tarih">Tarih</option>
                        <option value="Distopya">Distopya</option>
                        <option value="Fantastik">Fantastik</option>
                        <option value="Felsefe">Felsefe</option>
                        <option value="Roman">Roman</option>
                        <option value="Macera">Macera</option>
                        <option value="Gotik">Gotik</option>
                    </select>
                </div>
            </div>
            <main>
                <h2>Popüler Kitaplar</h2>
                <div className="row">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book, index) => (
                            <BookCard book={book} userId={userId} addToCart={addToCart} key={index} />
                        ))
                    ) : (
                        <p>Kitap bulunamadı</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
