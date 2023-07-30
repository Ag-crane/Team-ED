package com.example.satellite.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "tle_data")
public class TleData {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "satellite_id")
    private String satelliteId;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private Date date;

    @Column(name = "satellite_number")
    private String satelliteNumber;

    @Column(name = "classification")
    private String classification;

    @Column(name = "launch")
    private String launch;

    @Column(name = "launch_piece")
    private String launchPiece;

    @Column(name = "epoch")
    private String epoch;

    @Column(name = "first_time_derivative")
    private String firstTimeDerivative;

    @Column(name = "second_time_derivative")
    private String secondTimeDerivative;

    @Column(name = "bstar_drag_term")
    private String bstarDragTerm;

    @Column(name = "ephemeris_type")
    private String ephemerisType;

    @Column(name = "element_number")
    private String elementNumber;

    @Column(name = "checksum")
    private String checksum;

    @Column(name = "inclination")
    private String inclination;

    @Column(name = "right_ascension")
    private String rightAscension;

    @Column(name = "eccentricity")
    private String eccentricity;

    @Column(name = "argument_of_perigee")
    private String argumentOfPerigee;

    @Column(name = "mean_anomaly")
    private String meanAnomaly;

    @Column(name = "mean_motion")
    private String meanMotion;

}