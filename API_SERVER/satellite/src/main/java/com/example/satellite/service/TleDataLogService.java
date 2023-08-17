package com.example.satellite.service;

import com.example.satellite.dto.FetchDataDto;
import com.example.satellite.repository.TleDataLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class TleDataLogService {

    @Autowired
    private TleDataLogRepository tleDataLogRepository;

    public List<FetchDataDto> getFetchDataAfterDate() {
        LocalDateTime endDate = LocalDateTime.now().minusDays(0).withHour(0).withMinute(0).withSecond(0).withNano(0); // 오늘 날짜의 00:00:00
        LocalDateTime startDate = endDate.minusDays(6); // 7일 전의 00:00:00
        return tleDataLogRepository.findFetchDataBetweenDates(startDate, endDate);
    }
}