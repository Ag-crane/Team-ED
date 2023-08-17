//package com.example.satellite.repository;
//
//import com.example.satellite.domain.TleDataLog;
//import com.example.satellite.dto.FetchDataDto;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Repository
//public interface TleDataLogRepository extends JpaRepository<TleDataLog, Integer> {
//
//    @Query("SELECT new com.example.satellite.dto.FetchDataDto(SUBSTRING(t.fetchTimestamp, 1, 10) as fetchDate, COUNT(t) as fetchCount) " +
//            "FROM TleDataLog t WHERE t.fetchTimestamp > :sevenDaysAgo GROUP BY SUBSTRING(t.fetchTimestamp, 1, 10)")
//    List<FetchDataDto> findFetchDataAfterDate(LocalDate sevenDaysAgo);
//}
