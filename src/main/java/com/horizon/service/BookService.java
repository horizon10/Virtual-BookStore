package com.horizon.service;

import com.horizon.entity.Book;
import com.horizon.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    @Transactional
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @Transactional
    public Book updateBook(Long id, Book updatedBook) {
        Book existingBook = getBookById(id);
        existingBook.setTitle(updatedBook.getTitle());
        existingBook.setAuthor(updatedBook.getAuthor());
        existingBook.setPrice(updatedBook.getPrice());
        existingBook.setDescription(updatedBook.getDescription());
        existingBook.setCategory(updatedBook.getCategory());
        existingBook.setStock(updatedBook.getStock());
        return bookRepository.save(existingBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<Book> searchBookByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Book> filterBooksByPrice(Double minPrice, Double maxPrice) {
        return bookRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public Double getTotalPrice() {
        return bookRepository.calculateTotalPrice();
    }

    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthorIgnoreCase(author);
    }

    @Transactional
    public void deleteAllBooks() {
        bookRepository.deleteAll();
    }

    public List<Book> getBooksSortedByTitle() {
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "title"));
    }

    public List<Book> getRecommendedBooks(Long bookId) {
        Book book = getBookById(bookId);
        List<Book> books =bookRepository.findByCategory(book.getCategory());
        return books.stream()
                .filter(b-> !b.getId().equals(bookId))
                .limit(2)
                .collect(Collectors.toList());
    }
}
