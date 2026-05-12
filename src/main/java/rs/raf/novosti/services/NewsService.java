package rs.raf.novosti.services;

import rs.raf.novosti.entities.News;
import rs.raf.novosti.entities.Tag;
import rs.raf.novosti.repositories.news.NewsRepository;
import rs.raf.novosti.repositories.tag.TagRepository;

import javax.inject.Inject;
import java.util.List;

public class NewsService {

    @Inject
    private NewsRepository newsRepository;

    @Inject
    private TagRepository tagRepository;

    public List<News> allNews(int page, int pageSize) {
        List<News> newsList = this.newsRepository.findAll(page, pageSize);
        for (News news : newsList) {
            news.setTags(this.tagRepository.findByNewsId(news.getId()));
        }
        return newsList;
    }

    public int newsCount() {
        return this.newsRepository.count();
    }

    public News findNews(Long id) {
        News news = this.newsRepository.findById(id);
        if (news != null) {
            news.setTags(this.tagRepository.findByNewsId(news.getId()));
        }
        return news;
    }

    public News addNews(News news, List<String> tagValues) {
        News saved = this.newsRepository.save(news);
        if (saved.getId() != null && tagValues != null) {
            for (String tagValue : tagValues) {
                if (tagValue != null && !tagValue.trim().isEmpty()) {
                    Tag tag = this.tagRepository.findOrCreate(tagValue);
                    this.tagRepository.addTagToNews(saved.getId(), tag.getId());
                }
            }
            saved.setTags(this.tagRepository.findByNewsId(saved.getId()));
        }
        return saved;
    }

    public News updateNews(Long id, News newsData, List<String> tagValues) {
        News news = this.newsRepository.findById(id);
        if (news == null) {
            return null;
        }

        news.setTitle(newsData.getTitle());
        news.setText(newsData.getText());
        news.setCategoryId(newsData.getCategoryId());

        this.newsRepository.update(news);

        // zameni tagove
        this.tagRepository.removeTagsFromNews(id);
        if (tagValues != null) {
            for (String tagValue : tagValues) {
                if (tagValue != null && !tagValue.trim().isEmpty()) {
                    Tag tag = this.tagRepository.findOrCreate(tagValue);
                    this.tagRepository.addTagToNews(id, tag.getId());
                }
            }
        }

        news.setTags(this.tagRepository.findByNewsId(id));
        return news;
    }

    public void deleteNews(Long id) {
        this.newsRepository.delete(id);
    }
}
