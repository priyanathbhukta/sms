package com.education.sms.dto;

import java.util.List;

/**
 * Generic wrapper for paginated responses.
 * 
 * @param <T> The type of content in the page
 */
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last,
        boolean first) {

    /**
     * Factory method to create PagedResponse from Spring's Page object.
     */
    public static <T> PagedResponse<T> from(org.springframework.data.domain.Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst());
    }
}
