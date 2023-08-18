package com.example.satellite.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class FetchData2Dto {
    private LocalDate fetchDate;
    private Long fetchCount;

}
