package com.stwmovers.taxi.application.dto.response;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParsedSeoResponse {

    private String title;
    private String canonical;

    @Builder.Default
    private Map<String, Object> meta = new LinkedHashMap<>();

    @Builder.Default
    private Map<String, Object> og = new LinkedHashMap<>();

    @Builder.Default
    private Map<String, Object> twitter = new LinkedHashMap<>();

    @Builder.Default
    private Map<String, Object> article = new LinkedHashMap<>();

    @Builder.Default
    private Map<String, Object> properties = new LinkedHashMap<>();

    @Builder.Default
    private Map<String, Object> links = new LinkedHashMap<>();

    private List<JsonNode> schema;
    private String rawHead;
}
