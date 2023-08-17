package com.example.satellite.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FetchDataDto {
    private LocalDate fetchDate;
    private long fetchCount;
}

