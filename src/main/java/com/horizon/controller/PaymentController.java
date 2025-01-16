// PaymentController.java
package com.horizon.controller;

import com.horizon.entity.Order;
import com.horizon.dto.PaymentRequest;
import com.horizon.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{userId}")
    public Order processPayment(@PathVariable Long userId, @RequestBody PaymentRequest paymentRequest) {
        return paymentService.processPayment(userId, paymentRequest.getPaymentMethodId(), paymentRequest.getAmount());
    }
}
