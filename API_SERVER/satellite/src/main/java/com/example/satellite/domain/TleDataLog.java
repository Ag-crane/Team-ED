package com.example.satellite.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class TleDataLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 255)
    private String satelliteId;

    @Column(length = 255)
    private String name;

    @Column
    private LocalDateTime date;

    @Column(length = 5)
    private String satelliteNumber;

    @Column(length = 1)
    private String classification;

    @Column(length = 5)
    private String launch;

    @Column(length = 2)
    private String firstLaunch;

    @Column(length = 1)
    private String launchPiece;

    @Column(length = 14)
    private String epoch;

    @Column(length = 10)
    private String firstTimeDerivative;

    @Column(length = 8)
    private String secondTimeDerivative;

    @Column(length = 8)
    private String bstarDragTerm;

    @Column(length = 1)
    private String ephemerisType;

    @Column(length = 4)
    private String elementNumber;

    @Column(length = 1)
    private String checksum;

    @Column(length = 8)
    private String inclination;

    @Column(length = 8)
    private String rightAscension;

    @Column(length = 7)
    private String eccentricity;

    @Column(length = 8)
    private String argumentOfPerigee;

    @Column(length = 8)
    private String meanAnomaly;

    @Column(length = 11)
    private String meanMotion;

    @Column
    private LocalDateTime fetchTimestamp;

    @Column
    private LocalDateTime changedTime;

    @Column
    private double latitude;

    @Column
    private double longitude;
}
