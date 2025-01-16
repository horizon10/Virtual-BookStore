package com.horizon.service;

import com.horizon.entity.Cart;
import com.horizon.entity.CartItem;
import com.horizon.entity.Order;
import com.horizon.entity.OrderItem;
import com.horizon.repository.OrderItemRepository;
import com.horizon.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public Order createOrder(Long userId, Cart cart) {
        // Yeni bir sipariş oluştur
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("PENDING"); // İlk durumda beklemede
        order.setTotalPrice(cart.getTotalPrice());
        order.setCreatedAt(LocalDateTime.now());

        // Siparişi kaydet
        Order savedOrder = orderRepository.save(order);

        // Sepetteki ürünleri siparişe ekle
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setBook(cartItem.getBook());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
