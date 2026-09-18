package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.CategoryRequest;
import com.ecommerce.ecommerce.dto.CategoryResponse;
import com.ecommerce.ecommerce.entity.Category;
import com.ecommerce.ecommerce.exception.CategoryInUseException;
import com.ecommerce.ecommerce.exception.CategoryNotFoundException;
import com.ecommerce.ecommerce.exception.DuplicateCategoryException;
import com.ecommerce.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        String trimmedName = categoryRequest.getName() != null ? categoryRequest.getName().trim() : "";
        if (categoryRepository.existsByName(trimmedName)) {
            throw new DuplicateCategoryException("Category already exists with name: " + trimmedName);
        }

        Category category = new Category();
        category.setName(trimmedName);

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));

        String trimmedName = categoryRequest.getName() != null ? categoryRequest.getName().trim() : "";
        if (!category.getName().equalsIgnoreCase(trimmedName) &&
                categoryRepository.existsByName(trimmedName)) {
            throw new DuplicateCategoryException("Category already exists with name: " + trimmedName);
        }

        category.setName(trimmedName);
        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Category not found with id: " + id);
        }

        // Prevent deletion of category that has products
        if (categoryRepository.hasProducts(id)) {
            throw new CategoryInUseException("Cannot delete category that has products assigned to it");
        }

        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }
}
