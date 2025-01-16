package com.horizon.controller;

import com.horizon.entity.Book;
import com.horizon.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    //Her endpoint için ResponseEntity kullanıldı.
// Bu, HTTP yanıtlarının daha esnek bir şekilde oluşturulmasını sağlar.
//Hataları ve yanıt durumlarını daha iyi yönetmek için ResponseEntity ile birlikte HTTP durum kodları kullanıldı.
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book savedBook = bookService.addBook(book);
        return ResponseEntity.ok(savedBook);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updatedBook = bookService.updateBook(id, book);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBookByTitle(@RequestParam String title) {
        List<Book> books = bookService.searchBookByTitle(title);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Book>> filterBooksByPrice(@RequestParam Double minPrice, @RequestParam Double maxPrice) {
        List<Book> books = bookService.filterBooksByPrice(minPrice, maxPrice);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/total-price")
    public ResponseEntity<Double> getTotalPrice() {
        Double totalPrice = bookService.getTotalPrice();
        return ResponseEntity.ok(totalPrice);
    }

    @GetMapping("/author")
    public ResponseEntity<List<Book>> getBooksByAuthor(@RequestParam String author) {
        List<Book> books = bookService.getBooksByAuthor(author);
        return ResponseEntity.ok(books);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllBooks() {
        bookService.deleteAllBooks();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<Book>> getBooksSortedByTitle() {
        List<Book> books = bookService.getBooksSortedByTitle();
        return ResponseEntity.ok(books);
    }

    @GetMapping("recommended/{id}")
    public ResponseEntity<List<Book>> getBooksByRecommendedBooks(@PathVariable Long id) {
        List<Book> recommendBooks=bookService.getRecommendedBooks(id);
        return ResponseEntity.ok(recommendBooks);
    }
}
