import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Kayıt işlemi
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                username,
                email,
                password
            });
            setSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            setError("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate("/login"), 3000); // 3 saniye sonra giriş sayfasına yönlendirir
        } catch (error) {
            setError("Kayıt başarısız: " + (error.response?.data?.message || error.message));
            setSuccess("");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Kayıt Ol</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-posta</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Şifre</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Şifreyi Onayla</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Kayıt Ol</button>
            </form>
            <p className="mt-3">
                Zaten hesabınız var mı? <a href="/login">Giriş yap</a>
            </p>
        </div>
    );
};

export default Register;
