package com.example.satellite.service;

import com.example.satellite.domain.TleData;
import com.example.satellite.dto.SatelliteDashboardDto;
import com.example.satellite.dto.RecentSatelliteDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.satellite.repository.TleDataRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TleDataService {

    private final TleDataRepository repository;

    public TleDataService(TleDataRepository repository) {
        this.repository = repository;
    }

    public List<RecentSatelliteDto> getRecentTleData() {
        List<TleData> tleDataList = repository.findAllByOrderByDateDesc();
        return tleDataList.stream()
                .map(this::convertToDashboardDto)
                .collect(Collectors.toList());
    }

    public List<SatelliteDashboardDto> getDashboardData() {
        List<TleData> allData = repository.findAllByOrderByDateDesc();

        return allData.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private RecentSatelliteDto convertToDashboardDto(TleData tleData) {
        RecentSatelliteDto dto = new RecentSatelliteDto();
        dto.setSatelliteNumber(tleData.getSatelliteNumber());
        dto.setName(tleData.getName());
        dto.setClassification(tleData.getClassification());
        // 이 부분은 최초 수집일과 최종 수집일을 어떻게 결정하는지에 따라 변경이 필요할 수 있습니다.
        dto.setCollectionDate(tleData.getDate());
        return dto;
    }

    public SatelliteDashboardDto convertToDto(TleData tleData) {
        SatelliteDashboardDto dto = new SatelliteDashboardDto();
        dto.setSatelliteNumber(tleData.getSatelliteNumber());
        dto.setName(tleData.getName());
        dto.setClassification(tleData.getClassification());
        return dto;
    }

    public Page<TleData> findPaginated(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        return this.repository.findAll(pageable);
    }

}
