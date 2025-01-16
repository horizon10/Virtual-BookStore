package com.horizon.controller;

import com.horizon.dto.ChangePasswordRequest;
import com.horizon.entity.Book;
import com.horizon.entity.User;
import com.horizon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")// Frontend'in çalıştığı port
public class UserController {

    @Autowired
    private  UserService userService;

    // Kullanıcı kaydı
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null); // Hata durumunda 400 döndürülür
        }
    }

    // Kullanıcı girişi ve doğrulama
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        try {
            User loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(loggedInUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(null); // Geçersiz şifre veya kullanıcı hatası
        }
    }

    // Kullanıcı bilgilerini getirme
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    // Favori kitapları getirme
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Book>> getFavoriteBooks(@PathVariable Long userId) {
        try {
            List<Book> favoriteBooks = userService.getFavoriteBooks(userId);
            return ResponseEntity.ok(favoriteBooks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping("/{userId}/favorites")
    public ResponseEntity<String> addFavoriteBook(@PathVariable Long userId, @RequestBody Long bookId) {
        try {
            userService.addFavoriteBook(userId, bookId);
            return ResponseEntity.ok("Kitap favorilere eklendi.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/favorites/{bookId}")
    public ResponseEntity<String> removeFavoriteBook(@PathVariable Long userId, @PathVariable Long bookId) {
        try {
            userService.removeFavoriteBook(userId, bookId);
            return ResponseEntity.ok("Kitap favorilerden kaldırıldı.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }



    // Kullanıcı çıkışı
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Başarıyla çıkış yapıldı.");
    }

    // Kullanıcı silme
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("Kullanıcı başarıyla silindi.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest changePasswordRequest) {
        System.out.println("Kullanıcı ID: " + userId);
        System.out.println("Mevcut Şifre: " + changePasswordRequest.getCurrentPassword());
        System.out.println("Yeni Şifre: " + changePasswordRequest.getNewPassword());

        userService.changePassword(userId, changePasswordRequest.getCurrentPassword(), changePasswordRequest.getNewPassword());
        return ResponseEntity.ok("Şifre başarıyla değiştirildi.");
    }

}
