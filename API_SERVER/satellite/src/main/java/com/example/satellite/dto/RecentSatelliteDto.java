package com.example.satellite.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class RecentSatelliteDto {
    private String satelliteNumber;
    private String name;
    private String classification;
    private Date collectionDate;
}
