package com.senac.biblioteca.service;

import com.senac.biblioteca.model.Livro;
import com.senac.biblioteca.model.StatusEmprestimo;
import com.senac.biblioteca.repository.EmprestimoRepository;
import com.senac.biblioteca.repository.LivroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final EmprestimoRepository emprestimoRepository;

    public LivroService(LivroRepository livroRepository, EmprestimoRepository emprestimoRepository) {
        this.livroRepository = livroRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro nao encontrado"));
    }

    public Livro salvar(Livro livro) {
        validarLivro(livro);
        if (livro.getQuantidadeDisponivel() == null) {
            livro.setQuantidadeDisponivel(livro.getQuantidadeTotal());
        } else if (livro.getQuantidadeDisponivel() > livro.getQuantidadeTotal()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade disponivel nao pode ser maior que a total");
        }
        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro dadosAtualizados) {
        Livro livro = buscarPorId(id);
        validarLivro(dadosAtualizados);
        long emprestimosAtivos = emprestimoRepository.countByLivroIdAndStatus(id, StatusEmprestimo.ATIVO);
        if (dadosAtualizados.getQuantidadeTotal() < emprestimosAtivos) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade total nao pode ser menor que os emprestimos ativos");
        }

        int quantidadeTotalAtual = livro.getQuantidadeTotal() == null ? 0 : livro.getQuantidadeTotal();
        int quantidadeDisponivelAtual = livro.getQuantidadeDisponivel() == null ? 0 : livro.getQuantidadeDisponivel();
        int emprestados = Math.max(0, quantidadeTotalAtual - quantidadeDisponivelAtual);
        int novaQuantidadeDisponivel = dadosAtualizados.getQuantidadeTotal() - emprestados;

        livro.setTitulo(dadosAtualizados.getTitulo());
        livro.setAutor(dadosAtualizados.getAutor());
        livro.setIsbn(dadosAtualizados.getIsbn());
        livro.setQuantidadeTotal(dadosAtualizados.getQuantidadeTotal());
        livro.setQuantidadeDisponivel(Math.max(0, novaQuantidadeDisponivel));
        return livroRepository.save(livro);
    }

    public void excluir(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro nao encontrado");
        }
        if (emprestimoRepository.countByLivroIdAndStatus(id, StatusEmprestimo.ATIVO) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao e possivel excluir livro com emprestimo ativo");
        }
        livroRepository.deleteById(id);
    }

    public void decrementarDisponibilidade(Long livroId) {
        Livro livro = buscarPorId(livroId);
        if (livro.getQuantidadeDisponivel() == null || livro.getQuantidadeDisponivel() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Livro sem exemplares disponiveis");
        }
        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() - 1);
        livroRepository.save(livro);
    }

    public void incrementarDisponibilidade(Long livroId) {
        Livro livro = buscarPorId(livroId);
        int quantidadeDisponivel = livro.getQuantidadeDisponivel() == null ? 0 : livro.getQuantidadeDisponivel();
        int quantidadeTotal = livro.getQuantidadeTotal() == null ? 0 : livro.getQuantidadeTotal();
        if (quantidadeDisponivel >= quantidadeTotal) {
            return;
        }
        livro.setQuantidadeDisponivel(quantidadeDisponivel + 1);
        livroRepository.save(livro);
    }

    private void validarLivro(Livro livro) {
        if (livro.getQuantidadeTotal() == null || livro.getQuantidadeTotal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade total invalida");
        }
    }
}
