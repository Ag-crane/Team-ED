package com.example.satellite.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class TleDataInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private int updatedCount;

    @Column
    private int newCount;

    @Column
    private int totalCount;

    @Column
    private LocalDateTime fetchTime;
}
