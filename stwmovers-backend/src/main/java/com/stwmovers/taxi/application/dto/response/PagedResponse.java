package com.stwmovers.taxi.application.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PagedResponse<T> {

    List<T> content;
    int page;
    int size;
    long totalElements;
    int totalPages;
}
