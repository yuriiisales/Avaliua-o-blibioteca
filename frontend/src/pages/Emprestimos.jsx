import { useEffect, useState } from 'react'
import { get, post, put } from '../services/api'

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([])
  const [livros, setLivros] = useState([])
  const [form, setForm] = useState({ livroId: '', nomeUsuario: '' })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregar()
    carregarLivros()
  }, [])

  async function carregar() {
    try {
      setErro('')
      setEmprestimos(await get('/emprestimos'))
    } catch (error) {
      setErro(error.message)
    }
  }

  async function carregarLivros() {
    try {
      setLivros(await get('/livros'))
    } catch (error) {
      setErro(error.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { livroId: Number(form.livroId), nomeUsuario: form.nomeUsuario.trim() }
    if (!payload.livroId || !payload.nomeUsuario) {
      setErro('Selecione um livro e informe o nome do usuario.')
      return
    }
    try {
      setErro('')
      setSalvando(true)
      await post('/emprestimos', payload)
      setForm({ livroId: '', nomeUsuario: '' })
      await Promise.all([carregar(), carregarLivros()])
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  async function devolver(id) {
    try {
      setErro('')
      await put(`/emprestimos/${id}/devolver`)
      await Promise.all([carregar(), carregarLivros()])
    } catch (error) {
      setErro(error.message)
    }
  }

  const livrosPorId = new Map(livros.map((livro) => [livro.id, livro]))
  const livrosDisponiveis = livros.filter((livro) => livro.quantidadeDisponivel > 0)

  return (
    <div>
      <h1>Emprestimos</h1>
      {erro && <p className="alert">{erro}</p>}
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Livro</label>
          <select
            value={form.livroId}
            onChange={(e) => setForm({ ...form, livroId: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {livrosDisponiveis.map((l) => (
              <option key={l.id} value={l.id}>{l.titulo} ({l.quantidadeDisponivel} disponiveis)</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Nome do usuario</label>
          <input
            value={form.nomeUsuario}
            onChange={(e) => setForm({ ...form, nomeUsuario: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={salvando}>{salvando ? 'Emprestando...' : 'Emprestar'}</button>
      </form>

      <table>
        <thead>
          <tr><th>Livro</th><th>Usuario</th><th>Status</th><th>Previsao</th><th>Acoes</th></tr>
        </thead>
        <tbody>
          {emprestimos.length === 0 && (
            <tr>
              <td colSpan="5">Nenhum emprestimo cadastrado.</td>
            </tr>
          )}
          {emprestimos.map((emp) => (
            <tr key={emp.id}>
              <td>{livrosPorId.get(emp.livroId)?.titulo || `Livro #${emp.livroId}`}</td>
              <td>{emp.nomeUsuario}</td>
              <td>{emp.status}</td>
              <td>{emp.dataDevolucaoPrevista}</td>
              <td>
                {emp.status === 'ATIVO' && (
                  <button onClick={() => devolver(emp.id)}>Devolver</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
