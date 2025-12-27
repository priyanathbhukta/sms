package com.education.sms.service;

import com.education.sms.dto.BookRequest;
import com.education.sms.entity.Book;

import java.util.List;

public interface BookService {

    Book addBook(BookRequest request);

    List<Book> getAllBooks();

    List<Book> getAvailableBooks();

    List<Book> searchBooksByTitle(String title);

    List<Book> searchBooksByAuthor(String author);

    Book getBookById(Long bookId);

    Book getBookByIsbn(String isbn);

    void deleteBook(Long bookId);
}
