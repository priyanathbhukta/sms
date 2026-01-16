package com.education.sms.controller;

import com.education.sms.dto.BookRequest;
import com.education.sms.dto.BookResponse;
import com.education.sms.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping
    @PreAuthorize("hasRole('LIBRARIAN')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> addBook(@RequestBody BookRequest request) {
        if (request.title() == null || request.isbn() == null || request.totalCopies() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(bookService.addBook(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<BookResponse>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/search/title")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<BookResponse>> searchByTitle(@RequestParam String title) {
        return ResponseEntity.ok(bookService.searchBooksByTitle(title));
    }

    @GetMapping("/search/author")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<BookResponse>> searchByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(bookService.searchBooksByAuthor(author));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'FACULTY', 'STUDENT')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookService.getBookById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/isbn/{isbn}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> getBookByIsbn(@PathVariable String isbn) {
        try {
            return ResponseEntity.ok(bookService.getBookByIsbn(isbn));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
