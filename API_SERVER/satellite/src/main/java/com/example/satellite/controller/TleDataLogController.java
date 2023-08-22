package com.example.satellite.controller;

import com.example.satellite.dto.FetchData2Dto;
import com.example.satellite.dto.FetchDataDto;
import com.example.satellite.service.TleDataLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tle-data-log")
public class TleDataLogController {

    @Autowired
    private TleDataLogService tleDataLogService;

    @GetMapping("/fetch-data")
    public List<FetchDataDto> getFetchDataAfterDate() {
        return tleDataLogService.getFetchDataAfterDate();
    }

    @GetMapping("/unique-satellite-count")
    public List<FetchData2Dto> getDistinctSatelliteIdCountsForPastWeek() {
        return tleDataLogService.getDistinctSatelliteIdCountsForPastWeek();
    }


}