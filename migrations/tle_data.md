# tle 수집 데이터 테이블 생성 쿼리

```

CREATE TABLE `team_ed_user3`.`tle_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `satellite_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NULL,
  `date` DATETIME NULL,
  `satellite_number` VARCHAR(5) NULL,
  `classification` VARCHAR(1) NULL,
  `launch` VARCHAR(5) NULL,
  `launch_piece` VARCHAR(1) NULL,
  `epoch` VARCHAR(14) NULL,
  `first_time_derivative` VARCHAR(10) NULL,
  `second_time_derivative` VARCHAR(8) NULL,
  `bstar_drag_term` VARCHAR(8) NULL,
  `ephemeris_type` VARCHAR(1) NULL,
  `element_number` VARCHAR(4) NULL,
  `checksum` VARCHAR(1) NULL,
  `inclination` VARCHAR(8) NULL,
  `right_ascension` VARCHAR(8) NULL,
  `eccentricity` VARCHAR(7) NULL,
  `argument_of_perigee` VARCHAR(8) NULL,
  `mean_anomaly` VARCHAR(8) NULL,
  `mean_motion` VARCHAR(11) NULL,
  `fetch_timestamp` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `satellite_id_UNIQUE` (`satellite_id` ASC) VISIBLE
);

```

