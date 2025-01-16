package com.horizon.service;

import com.horizon.entity.Order;
import com.horizon.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public Order processPayment(Long userId, String paymentMethodId, int amount) {
        // Minimum ödeme tutarı kontrolü (Stripe gereklilikleri)
        if (amount < 50) { // USD için minimum 0.50 USD (cent olarak: 50)
            System.out.println("Ödeme Tutarı: " + amount + " cent");

            throw new RuntimeException("Ödeme tutarı minimum gereklilikleri karşılamıyor. Minimum tutar 0.50 USD olmalıdır.");
        }

        try {
            // Stripe ödeme işlemi için parametreler
            Map<String, Object> paymentIntentParams = new HashMap<>();
            paymentIntentParams.put("amount", amount); // Cent cinsinden tutar (Örneğin: 500 = 5.00 USD)
            paymentIntentParams.put("currency", "usd"); // Para birimi
            paymentIntentParams.put("payment_method", paymentMethodId); // PaymentMethod ID
            paymentIntentParams.put("confirmation_method", "manual"); // Manual onay
            paymentIntentParams.put("confirm", true); // Ödemeyi anında onayla

            // Ödeme işlemini başlat
            PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);

            // Ödeme başarılıysa, siparişi kaydet
            if ("succeeded".equals(paymentIntent.getStatus())) {
                Order order = new Order();
                order.setUserId(userId);
                order.setTotalPrice(BigDecimal.valueOf(amount / 100.0)); // Cent -> USD dönüşümü
                order.setStatus("Completed");

                return orderRepository.save(order);
            } else {
                throw new RuntimeException("Ödeme başarısız oldu. Durum: " + paymentIntent.getStatus());
            }

        } catch (StripeException e) {
            // Stripe hatalarını işleyin
            throw new RuntimeException("Stripe ödeme hatası: " + e.getMessage(), e);
        }
    }
}
