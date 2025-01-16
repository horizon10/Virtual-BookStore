package com.horizon.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "content", nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;
}
