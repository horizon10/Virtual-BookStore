import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StarButton = ({ bookId }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isFavorite, setIsFavorite] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/${user.id}/favorites`);
                    const favoriteBooks = response.data;
                    setIsFavorite(favoriteBooks.some(book => book.id === bookId));
                } catch (error) {
                    console.error("Favori kitap kontrol edilirken hata oluştu: ", error);
                }
            }
        };
        checkIfFavorite();
    }, [user, bookId]);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/users/${user.id}/favorites/${bookId}`, {
                    data: bookId,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setNotificationMessage("Favorilerden çıkarıldı!");
            } else {
                await axios.post(`http://localhost:5000/api/users/${user.id}/favorites`, bookId, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setNotificationMessage("Favorilere eklendi!");
            }
            setIsFavorite(!isFavorite);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000); // Bildirimi 5 saniye sonra gizle
        } catch (error) {
            console.error("Favori kitap eklenirken/kaldırılırken hata oluştu: ", error);
        }
    };

    return (
        <div>
            <button onClick={handleFavoriteClick} style={{ background: 'none', border: 'none' }}>
                <i className="bi bi-star-fill" style={{ fontSize: '20px', color: isFavorite ? 'gold' : 'grey' }}></i>
            </button>
            {showNotification && (
                <div className="notification" style={{ position: 'fixed', top: '10px', right: '10px', background: 'lightgreen', padding: '10px', borderRadius: '5px' }}>
                    {notificationMessage}
                </div>
            )}
        </div>
    );
};

export default StarButton;
