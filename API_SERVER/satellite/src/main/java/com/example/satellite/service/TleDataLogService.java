package com.example.satellite.service;

import com.example.satellite.dto.FetchData2Dto;
import com.example.satellite.dto.FetchData2ProjectionInterface;
import com.example.satellite.dto.FetchDataDto;
import com.example.satellite.repository.TleDataLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TleDataLogService {

    @Autowired
    private TleDataLogRepository tleDataLogRepository;

    public List<FetchDataDto> getFetchDataAfterDate() {
        LocalDateTime now = LocalDateTime.now();
        List<FetchDataDto> results = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate localDate = now.minusDays(i).toLocalDate();
            Date specificDate = java.sql.Date.valueOf(localDate);
            Long currentCount = tleDataLogRepository.countByFetchTimestampOnSpecificDate(specificDate);

            LocalDate previousLocalDate = localDate.minusDays(1);
            Date previousSpecificDate = java.sql.Date.valueOf(previousLocalDate);  // Convert LocalDate to java.util.Date

            Long previousCount = tleDataLogRepository.countByFetchTimestampOnSpecificDate(previousSpecificDate);

            FetchDataDto dto = new FetchDataDto();
            dto.setFetchDate(localDate);
            dto.setFetchCount(currentCount - previousCount);

            results.add(dto);
        }

        return results;
    }

    public List<FetchData2Dto> getDistinctSatelliteIdCountsForPastWeek() {
        LocalDateTime endDate = LocalDateTime.now().minusDays(1);
        LocalDateTime startDate = endDate.minusDays(6);

        List<FetchData2ProjectionInterface> projections = tleDataLogRepository.findDistinctSatelliteIdCounts(startDate, endDate);

        List<FetchData2Dto> results = new ArrayList<>();
        for (FetchData2ProjectionInterface projection : projections) {
            FetchData2Dto dto = new FetchData2Dto(projection.getFetchDate(), projection.getFetchCount());
            results.add(dto);
        }

        return results;
    }

}