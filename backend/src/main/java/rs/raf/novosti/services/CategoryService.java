package rs.raf.novosti.services;

import rs.raf.novosti.entities.Category;
import rs.raf.novosti.repositories.category.CategoryRepository;

import javax.inject.Inject;
import java.util.List;

public class CategoryService {

    @Inject
    private CategoryRepository categoryRepository;

    public List<Category> allCategories(int page, int pageSize) {
        return this.categoryRepository.findAll(page, pageSize);
    }

    public List<Category> allCategories() {
        return this.categoryRepository.findAll();
    }

    public List<Category> allCategoriesWithCounts() {
        return this.categoryRepository.findAllWithCounts();
    }

    public int categoryCount() {
        return this.categoryRepository.count();
    }

    public Category findCategory(Long id) {
        return this.categoryRepository.findById(id);
    }

    public Category addCategory(Category category) {
        Category existing = this.categoryRepository.findByName(category.getName());
        if (existing != null) {
            return null;
        }
        return this.categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryData) {
        Category category = this.categoryRepository.findById(id);
        if (category == null) {
            return null;
        }

        Category nameCategory = this.categoryRepository.findByName(categoryData.getName());
        if (nameCategory != null && !nameCategory.getId().equals(id)) {
            return null;
        }

        category.setName(categoryData.getName());
        category.setDescription(categoryData.getDescription());

        return this.categoryRepository.update(category);
    }

    public boolean deleteCategory(Long id) {
        int newsCount = this.categoryRepository.countNewsByCategoryId(id);
        if (newsCount > 0) {
            return false;
        }
        this.categoryRepository.delete(id);
        return true;
    }
}
