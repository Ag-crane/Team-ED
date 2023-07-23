# tle 수집 데이터 테이블 생성 쿼리

```

CREATE TABLE tle_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  satellite_id VARCHAR(255),
  name VARCHAR(255),
  date DATE,
  satellite_number VARCHAR(5),
  classification VARCHAR(1),
  launch VARCHAR(5),
  launch_piece VARCHAR(1),
  epoch VARCHAR(14),
  first_time_derivative VARCHAR(10),
  second_time_derivative VARCHAR(8),
  bstar_drag_term VARCHAR(8),
  ephemeris_type VARCHAR(1),
  element_number VARCHAR(4),
  checksum VARCHAR(1),
  inclination VARCHAR(8),
  right_ascension VARCHAR(8),
  eccentricity VARCHAR(7),
  argument_of_perigee VARCHAR(8),
  mean_anomaly VARCHAR(8),
  mean_motion VARCHAR(11)
);

```

