package com.example.satellite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTleDataDto { // tle_data 수정할때 쓸 dto
    private String satelliteNumber;
    private String name;
    private String classification;
    private String firstLaunch;
}
