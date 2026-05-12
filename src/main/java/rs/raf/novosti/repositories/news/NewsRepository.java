package rs.raf.novosti.repositories.news;

import rs.raf.novosti.entities.News;

import java.util.List;

public interface NewsRepository {
    News findById(Long id);
    List<News> findAll(int page, int pageSize);
    int count();
    News save(News news);
    News update(News news);
    void delete(Long id);
    void incrementVisits(Long newsId);
}
