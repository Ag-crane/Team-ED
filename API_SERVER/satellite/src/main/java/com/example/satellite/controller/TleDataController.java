package com.example.satellite.controller;

import com.example.satellite.domain.TleData;
import com.example.satellite.dto.RecentSatelliteDto;
import com.example.satellite.dto.SatelliteDashboardDto;
import com.example.satellite.repository.TleDataRepository;
import com.example.satellite.service.TleDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/data")
public class TleDataController {

    private final TleDataService service;
    private final TleDataRepository repository;

    @Autowired
    public TleDataController(TleDataService service, TleDataRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public List<TleData> getAllTleData() {
        return repository.findAll();
    }

    @GetMapping("/page/{pageNo}")
    public Page<TleData> getPaginatedTleData(@PathVariable int pageNo) {
        return service.findPaginated(pageNo, 15);
    }

    @GetMapping("/recent")
    public List<RecentSatelliteDto> getRecentTleData() {
        return service.getRecentTleData();
    }

    @GetMapping("/dashboard")
    public List<SatelliteDashboardDto> getDashboardData() {
        List<SatelliteDashboardDto> allData = service.getDashboardData();

        return allData;
    }

    @GetMapping("/test")
    public String test(){
        return "test";
    }
}