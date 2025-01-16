import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            setError("");
            localStorage.setItem("user", JSON.stringify(response.data));
            setIsLoggedIn(true);
            navigate("/home");
        } catch (error) {
            setError("Giriş başarısız: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Giriş Yap</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">Giriş Yap</button>
            </form>
            <p className="mt-3">
                Hesabınız yok mu? <a href="/register">Kayıt ol</a>
            </p>
        </div>
    );
};

export default Login;
