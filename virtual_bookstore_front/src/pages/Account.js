import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [error, setError] = useState("");
    const [currentPassword, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.id) {
                    setError("Kullanıcı ID'si bulunamadı.");
                    return;
                }
                const userResponse = await axios.get(`http://localhost:5000/api/users/${user.id}`);
                const booksResponse = await axios.get(`http://localhost:5000/api/users/${user.id}/favorites`);
                setUser(userResponse.data);
                setFavoriteBooks(booksResponse.data);
            } catch (error) {
                setError("Kullanıcı bilgileri alınamadı: " + error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload(); // Sayfayı yeniden yükleyerek isLoggedIn durumunu güncelle
    };

    const handleDeleteAccount = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id) {
                setError("Kullanıcı ID'si bulunamadı.");
                return;
            }
            await axios.delete(`http://localhost:5000/api/users/${user.id}`);
            localStorage.removeItem("user");
            navigate("/register");
            
            window.location.reload(); // Sayfayı yeniden yükleyerek isLoggedIn durumunu güncelle
        } catch (error) {
            setError("Hesap silinemedi: " + error.message);
        }
    };

    const handleRemoveFavorite = async (bookId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await axios.delete(`http://localhost:5000/api/users/${user.id}/favorites/${bookId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFavoriteBooks(favoriteBooks.filter(book => book.id !== bookId));
        } catch (error) {
            setError("Favori kitaptan çıkarma işlemi başarısız: " + error.message);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Yeni şifreler uyuşmuyor.");
            return;
        }
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await axios.post(`http://localhost:5000/api/users/${user.id}/change-password`, { currentPassword, newPassword }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            setError("Şifre başarıyla değiştirildi.");
        } catch (error) {
            setError("Şifre değiştirilemedi: " + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Hesabım</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="card-title">Kullanıcı Bilgileri</h3>
                    <p className="card-text"><strong>Kullanıcı Adı:</strong> {user.username}</p>
                    <p className="card-text"><strong>E-posta:</strong> {user.email}</p>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="card-title">Favori Kitaplar</h3>
                    <ul className="list-group">
                        {favoriteBooks.map((book) => (
                            <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{book.title}</strong> - {book.author}
                                </div>
                                <div>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => navigate(`/book/${book.id}`)}
                                    >
                                        Detaylara Git
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleRemoveFavorite(book.id)}
                                    >
                                        Favorilerden Çıkar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="card-title">Şifre Değiştir</h3>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mevcut Şifre</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={currentPassword}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleChangePassword}>Şifreyi Değiştir</button>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn btn-danger" onClick={handleDeleteAccount}>Hesabı Sil</button>
                <button className="btn btn-secondary" onClick={handleLogout}>Çıkış Yap</button>
            </div>
        </div>
    );
};

export default Account;
