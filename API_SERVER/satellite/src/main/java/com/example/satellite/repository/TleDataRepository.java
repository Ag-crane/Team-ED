package com.example.satellite.repository;

import com.example.satellite.domain.TleData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TleDataRepository extends JpaRepository<TleData, Long> {
    List<TleData> findAllByOrderByDateDesc();

    Page<TleData> findAll(Pageable pageable);

    Page<TleData> findAllByOrderByFetchTimestampDesc(Pageable pageable);

    List<TleData> findByName(String satelliteName);

    // 이름에 주어진 문자열이 포함된 모든 데이터를 검색
    List<TleData> findByNameContaining(String satelliteName);

    Optional<TleData> findBySatelliteId(String satelliteId);
}
