package com.example.satellite.service;

import com.example.satellite.domain.TleDataInfo;
import com.example.satellite.repository.TleDataInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TleDataInfoService {

    @Autowired
    private TleDataInfoRepository tleDataInfoRepository;

    public List<TleDataInfo> getAllTleDataInfos() {
        return tleDataInfoRepository.findAll();
    }

    public Optional<TleDataInfo> getTleDataInfoById(int id) {
        return tleDataInfoRepository.findById(id);
    }
}