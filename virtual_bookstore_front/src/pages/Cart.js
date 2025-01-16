import React from "react";

const Cart = ({ cartItems, removeFromCart, onPaymentClick }) => {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="container mt-4">
            <h2>Sepetim</h2>
            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p>Sepetiniz şu anda boş.</p>
                    <a href="/home" className="btn btn-primary">
                        Alışverişe Başla
                    </a>
                </div>
            ) : (
                <>
                    <ul className="list-group mb-4">
                        {cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{item.title}</strong> - {item.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeFromCart(index)}
                                >
                                    Kaldır
                                </button>
                            </li>
                        ))}
                    </ul>
                    <h5>Toplam Fiyat: {totalPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</h5>
                    <button className="btn btn-success" onClick={() => onPaymentClick(totalPrice)}>
                        <i className="bi bi-credit-card"></i> Ödemeye Geç
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;
