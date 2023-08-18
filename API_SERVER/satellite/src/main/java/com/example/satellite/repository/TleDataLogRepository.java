package com.example.satellite.repository;

import com.example.satellite.domain.TleDataLog;
import com.example.satellite.dto.FetchData2Dto;
import com.example.satellite.dto.FetchData2ProjectionInterface;
import com.example.satellite.dto.FetchDataDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface TleDataLogRepository extends JpaRepository<TleDataLog, Integer> {

    @Query("SELECT new com.example.satellite.dto.FetchDataDto(DATE(t.date) as fetchDate, COUNT(t) as fetchCount) " +
            "FROM TleDataLog t WHERE t.date >= :startDate AND t.date < :endDate GROUP BY DATE(t.date)")
    List<FetchDataDto> findFetchDataBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(t) FROM TleDataLog t WHERE DATE(t.date) = :specificDate")
    Long countByFetchTimestampOnSpecificDate(Date specificDate);

    @Query("SELECT DATE(t.fetchTimestamp) as fetchDate, COUNT(DISTINCT t.satelliteId) as fetchCount " +
            "FROM TleDataLog t WHERE t.fetchTimestamp >= :startDate AND t.fetchTimestamp < :endDate " +
            "GROUP BY DATE(t.fetchTimestamp)")
    List<FetchData2ProjectionInterface> findDistinctSatelliteIdCounts(LocalDateTime startDate, LocalDateTime endDate);


}