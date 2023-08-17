package com.example.satellite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class FetchDataDto {
    private Date fetchDate;
    private long fetchCount;
}