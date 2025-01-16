package com.horizon.repository;

import com.horizon.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Book> findByAuthorIgnoreCase(String author);
    List<Book> findByCategory(String category);

    @Query("SELECT SUM(b.price) FROM Book b")
    Double calculateTotalPrice();

    @Query("SELECT b FROM Book b JOIN Favorite f ON b.id = f.bookId WHERE f.userId = :userId")
    List<Book> findFavoriteBooksByUserId(Long userId);
}
