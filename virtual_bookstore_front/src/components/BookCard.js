import React from "react";
import { useNavigate } from "react-router-dom";
import StarButton from "./StarButton";

const BookCard = ({ book, addToCart }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/book/${book.id}`);
    };

    return (
        <div className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="card h-100" onClick={handleCardClick} style={{ cursor: "pointer", width: "100%" }}>
                <div style={{ height: "250px", overflow: "hidden" }}>
                    <img 
                        src={book.image_url ? `/images/${book.image_url}` : '/images/1984.jpg'}
                        className="card-img-top"
                        alt={book.title || 'Kitap resmi'}
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">Yazar: {book.author}</p>
                    <p className="card-text">Fiyat: {book.price} TL</p>
                    <div className="mt-auto">
                        <button
                            className="btn btn-primary w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(book);
                            }}
                        >
                            Sepete Ekle
                        </button>
                        <div className="mt-2 text-end">
                            <StarButton bookId={book.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
