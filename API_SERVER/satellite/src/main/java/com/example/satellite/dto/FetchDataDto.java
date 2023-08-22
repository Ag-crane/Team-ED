package com.example.satellite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FetchDataDto {
    private LocalDate fetchDate;
    private long fetchCount;

    public FetchDataDto(Date fetchDate, long fetchCount) {
        this.fetchDate = fetchDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.fetchCount = fetchCount;
    }
}