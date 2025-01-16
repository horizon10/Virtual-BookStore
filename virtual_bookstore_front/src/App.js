import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Home from './pages/Home';
import PaymentModal from './components/PaymentModal';
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("..."); // Stripe public key burada olmalı

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setIsLoggedIn(true);
        }
    }, []);

    const addToCart = (book) => {
        setCartItems([...cartItems, book]);
    };

    const removeFromCart = (index) => {
        const newCartItems = [...cartItems];
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
    };

    const handlePaymentSubmit = async (paymentMethodId) => {
        try {
            // Kullanıcıyı localStorage'dan al
            const user = JSON.parse(localStorage.getItem("user"));

            // Kullanıcının oturum açıp açmadığını kontrol et
            if (!user || !user.id) {
                throw new Error("Kullanıcı oturumu açık değil. Lütfen giriş yapın.");
            }

            // Miktarı cent cinsine çevir
            const amountInCents = totalAmount * 100;
            console.log("Gönderilen tutar (cent cinsinden):", amountInCents);

            // Ödeme isteğini gönder
            const response = await fetch(`http://localhost:5000/api/payment/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethodId, amount: amountInCents }) // amount'u cent cinsinden gönderiyoruz
            });

            // HTTP isteği başarısız olduysa hata fırlat
            if (!response.ok) {
                throw new Error('Ödeme işlemi başarısız oldu.');
            }

            // Yanıtı ayrıştır
            const paymentResult = await response.json();

            // Ödeme işlemi başarılıysa
            alert("Ödeme başarıyla tamamlandı!");
            setCartItems([]);  // Sepeti temizle
        } catch (error) {
            // Hata durumunda
            alert(error.message);
        }
    };

    return (
        <Elements stripe={stripePromise}>
            <Router>
                <Navbar bg="light" expand="lg" className="mb-4">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Virtual Bookstore</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/home">Ana Sayfa</Nav.Link>
                                {isLoggedIn && <Nav.Link as={Link} to="/account" className="nav-link">Hesabım</Nav.Link>}
                            </Nav>
                            <Nav>
                                {!isLoggedIn ? (
                                    <>
                                        <Nav.Link as={Link} to="/login" className="nav-link">Giriş Yap</Nav.Link>
                                        <Nav.Link as={Link} to="/register" className="nav-link">Kayıt Ol</Nav.Link>
                                    </>
                                ) : (
                                    <Nav.Link as={Link} to="/account" className="nav-link">
                                        <i className="bi bi-person-circle" style={{ fontSize: '1.5rem', marginRight: '5px' }}></i>
                                        Hesabım
                                    </Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/cart">
                                    <Button variant="outline-primary">Sepetim <Badge bg="danger">{cartItems.length}</Badge></Button>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home addToCart={addToCart} />} />
                        <Route path="/cart" element={
                            <Cart cartItems={cartItems} removeFromCart={removeFromCart} onPaymentClick={(amount) => { setTotalAmount(amount); setShowPaymentModal(true); }} />
                        } />
                        <Route path="/book/:id" element={<BookDetail addToCart={addToCart} />} />
                        <Route path="/account" element={<Account />} />
                    </Routes>

                </Container>
                <PaymentModal show={showPaymentModal} handleClose={() => setShowPaymentModal(false)} handleSubmit={handlePaymentSubmit} />
            </Router>
        </Elements>
    );
}

export default App;
