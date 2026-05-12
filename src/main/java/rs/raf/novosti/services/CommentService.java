package rs.raf.novosti.services;

import rs.raf.novosti.entities.Comment;
import rs.raf.novosti.repositories.comment.CommentRepository;

import javax.inject.Inject;
import java.util.List;

public class CommentService {

    @Inject
    private CommentRepository commentRepository;

    public List<Comment> commentsByNews(Long newsId, int page, int pageSize) {
        return this.commentRepository.findByNewsId(newsId, page, pageSize);
    }

    public int commentsByNewsCount(Long newsId) {
        return this.commentRepository.countByNewsId(newsId);
    }

    public Comment addComment(Comment comment) {
        return this.commentRepository.save(comment);
    }
}
