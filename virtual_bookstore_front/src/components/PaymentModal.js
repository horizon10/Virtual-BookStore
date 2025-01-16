import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentModal = ({ show, handleClose, handleSubmit }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [address, setAddress] = useState("");

    const handlePaymentSubmit = async () => {
        if (!address.trim()) {
            alert("Adres alanı boş olamaz.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                address: {
                    line1: address,
                },
            },
        });

        if (error) {
            alert(error.message);
            return;
        }

        handleSubmit(paymentMethod.id);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ödeme Bilgilerinizi Girin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Adres</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Adresinizi girin"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCardNumber" className="mt-3">
                        <Form.Label>Kart Numarası</Form.Label>
                        <CardElement className="form-control" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Kapat</Button>
                <Button variant="primary" onClick={handlePaymentSubmit}>Ödeme Yap</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;
