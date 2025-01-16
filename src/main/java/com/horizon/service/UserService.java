package com.horizon.service;

import com.horizon.entity.Book;
import com.horizon.entity.Favorite;
import com.horizon.entity.User;
import com.horizon.repository.UserRepository;
import com.horizon.repository.BookRepository;
import com.horizon.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private  UserRepository userRepository;
    private final BookRepository bookRepository;

    @Autowired
    private  FavoriteRepository favoriteRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Bu e-posta zaten kayıtlı.");
        }
        // Şifreyi güvenli şekilde şifrele
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Kullanıcıyı veritabanına kaydet
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        // Veritabanında kullanıcıyı e-posta ile ara
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        // Şifreyi kontrol et
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Geçersiz şifre.");
        }

        // Eğer doğrulama başarılıysa, kullanıcıyı döndür
        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));
    }

    @Transactional
    public void deleteUser(Long userId) {
        favoriteRepository.deleteById(userId);

        userRepository.deleteById(userId);
    }

    public List<Book> getFavoriteBooks(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(favorite -> bookRepository.findById(favorite.getBookId()).orElseThrow(() -> new RuntimeException("Kitap bulunamadı.")))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavoriteBook(Long userId, Long bookId) {
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndBookId(userId, bookId);
        if (existingFavorite.isPresent()) {
            throw new RuntimeException("Bu kitap zaten favorilerinizde.");
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setBookId(bookId);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavoriteBook(Long userId, Long bookId) {
        Optional<Favorite> favorite = favoriteRepository.findByUserIdAndBookId(userId, bookId);
        if (favorite.isPresent()) {
            favoriteRepository.delete(favorite.get());
        } else {
            throw new RuntimeException("Bu kitap favorilerinizde değil.");
        }
    }
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));
        if (currentPassword == null || currentPassword.isEmpty()) {
            throw new IllegalArgumentException("Mevcut şifre boş olamaz.");
        } if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("Yeni şifre boş olamaz.");
        } if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Mevcut şifre hatalı.");
        } user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
