package com.example.satellite.repository;

import com.example.satellite.domain.TleDataLog;
import com.example.satellite.dto.FetchDataDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TleDataLogRepository extends JpaRepository<TleDataLog, Integer> {

    @Query("SELECT new com.example.satellite.dto.FetchDataDto(DATE(t.fetchTimestamp) as fetchDate, COUNT(t) as fetchCount) " +
            "FROM TleDataLog t WHERE t.fetchTimestamp >= :startDate AND t.fetchTimestamp < :endDate GROUP BY DATE(t.fetchTimestamp)")
    List<FetchDataDto> findFetchDataBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
