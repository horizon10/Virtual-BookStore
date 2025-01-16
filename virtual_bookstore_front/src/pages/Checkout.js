import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function Checkout() {
    const [address, setAddress] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                address: { line1: address }
            }
        });

        if (error) {
            alert(error.message);
        } else {
            // Backend API çağrısını yapın
            const user = JSON.parse(localStorage.getItem("user"));
            const amount = 10.00; // Örnek olarak 10.00 USD
            const amountInCents = amount * 100;

            try {
                const response = await fetch(`http://localhost:5000/api/payment/${user.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: amountInCents }) // amount'u cent cinsinden gönderiyoruz
                });

                if (!response.ok) {
                    throw new Error('Ödeme işlemi başarısız oldu.');
                }

                const paymentResult = await response.json();

                // Ödeme işlemi başarılıysa
                alert("Ödeme başarıyla tamamlandı!");
                // Sepeti temizle veya başka bir işlem yap
            } catch (error) {
                // Hata durumunda
                alert(error.message);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Ödeme Sayfası</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Adresinizi girin"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Kart Numarası</Form.Label>
                    <CardElement className="form-control" />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={!stripe}>
                    Ödeme Yap
                </Button>
            </Form>
        </div>
    );
}

export default Checkout;
