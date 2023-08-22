package com.example.satellite.repository;

import com.example.satellite.domain.TleDataInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TleDataInfoRepository extends JpaRepository<TleDataInfo, Integer> {
}
