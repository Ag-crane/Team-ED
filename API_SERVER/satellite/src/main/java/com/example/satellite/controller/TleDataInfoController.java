package com.example.satellite.controller;

import com.example.satellite.domain.TleDataInfo;
import com.example.satellite.service.TleDataInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tle-data-info")
public class TleDataInfoController {

    @Autowired
    private TleDataInfoService tleDataInfoService;

    @GetMapping
    public List<TleDataInfo> getAllTleDataInfos() {
        return tleDataInfoService.getAllTleDataInfos();
    }

    @GetMapping("/{id}")
    public Optional<TleDataInfo> getTleDataInfoById(@PathVariable int id) {
        return tleDataInfoService.getTleDataInfoById(id);
    }
}