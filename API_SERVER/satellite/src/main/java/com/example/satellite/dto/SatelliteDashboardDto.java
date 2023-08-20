package com.example.satellite.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class SatelliteDashboardDto { // 데이터 목록
    private String satelliteNumber;
    private String name;
    private String classification;
}
