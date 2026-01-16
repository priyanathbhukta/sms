package com.education.sms.service;

import com.education.sms.dto.BookRequest;
import com.education.sms.dto.BookResponse;

import java.util.List;

public interface BookService {

    BookResponse addBook(BookRequest request);

    List<BookResponse> getAllBooks();

    List<BookResponse> getAvailableBooks();

    List<BookResponse> searchBooksByTitle(String title);

    List<BookResponse> searchBooksByAuthor(String author);

    BookResponse getBookById(Long bookId);

    BookResponse getBookByIsbn(String isbn);

    void deleteBook(Long bookId);
}
