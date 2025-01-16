package com.horizon.dto;

public class PaymentRequest {
    private String paymentMethodId;
    private int amount;

    // Getter ve Setter metodları
    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
