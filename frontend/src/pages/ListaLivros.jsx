import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, del } from '../services/api'

export default function ListaLivros() {
  const [livros, setLivros] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    try {
      setErro('')
      setCarregando(true)
      setLivros(await get('/livros'))
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  async function excluir(id) {
    if (!window.confirm('Deseja excluir este livro?')) return
    try {
      setErro('')
      await del(`/livros/${id}`)
      await carregar()
    } catch (error) {
      setErro(error.message)
    }
  }

  return (
    <div>
      <h1>Livros</h1>
      {erro && <p className="alert">{erro}</p>}
      {carregando && <p>Carregando livros...</p>}
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Disponiveis</th>
            <th>Total</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {!carregando && livros.length === 0 && (
            <tr>
              <td colSpan="5">Nenhum livro cadastrado.</td>
            </tr>
          )}
          {livros.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.quantidadeDisponivel}</td>
              <td>{livro.quantidadeTotal}</td>
              <td>
                <Link to={`/livros/${livro.id}/editar`}>Editar</Link>
                {' '}
                <button className="danger" onClick={() => excluir(livro.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
