package com.group_6.book_store.service;

import com.group_6.book_store.dto.AuthorDTO;
import com.group_6.book_store.entity.Author;
import com.group_6.book_store.form.AuthorCreateForm;
import com.group_6.book_store.form.AuthorUpdateForm;
import com.group_6.book_store.mapper.AuthorMapper;
import com.group_6.book_store.repository.AuthorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    public AuthorService(AuthorRepository authorRepository, AuthorMapper authorMapper) {
        this.authorRepository = authorRepository;
        this.authorMapper = authorMapper;
    }

    public Page<AuthorDTO> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable)
                .map(authorMapper::toDTO);
    }

    public Page<AuthorDTO> searchAuthors(String searchTerm, Pageable pageable) {
        return authorRepository.findByNameContainingIgnoreCase(searchTerm, pageable)
                .map(authorMapper::toDTO);
    }

    public AuthorDTO getAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        return authorMapper.toDTO(author);
    }

    public AuthorDTO createAuthor(AuthorCreateForm form) {
        Author author = authorMapper.toEntity(form);
        author = authorRepository.save(author);
        return authorMapper.toDTO(author);
    }

    public AuthorDTO updateAuthor(Long id, AuthorUpdateForm form) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        // Chỉ cập nhật các trường có giá trị trong form, các trường null sẽ giữ nguyên giá trị hiện tại
        // Nhờ nullValuePropertyMappingStrategy = IGNORE trong AuthorMapper
        authorMapper.updateEntityFromForm(form, author);
        author = authorRepository.save(author);
        return authorMapper.toDTO(author);
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
    }
}