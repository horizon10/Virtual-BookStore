package com.horizon.service;

import com.horizon.entity.Comment;
import com.horizon.entity.User;
import com.horizon.repository.CommentRepository;
import com.horizon.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookId(bookId);
    }

    public Comment addComment(Comment comment) {
        User user = userRepository.findById(comment.getUserId()).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        comment.setUserName(user.getUsername()); // Kullanıcı adını set et
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
