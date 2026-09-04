package com.senac.biblioteca.repository;

import com.senac.biblioteca.model.Emprestimo;
import com.senac.biblioteca.model.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    List<Emprestimo> findByLivroId(Long livroId);
    long countByLivroIdAndStatus(Long livroId, StatusEmprestimo status);
}
