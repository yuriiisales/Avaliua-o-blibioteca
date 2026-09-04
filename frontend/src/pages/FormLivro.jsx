import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post, put } from '../services/api'

export default function FormLivro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ titulo: '', autor: '', isbn: '', quantidadeTotal: 1 })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (id) {
      get(`/livros/${id}`).then(setForm).catch((error) => setErro(error.message))
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      titulo: (form.titulo || '').trim(),
      autor: (form.autor || '').trim(),
      isbn: (form.isbn || '').trim(),
      quantidadeTotal: Number(form.quantidadeTotal),
    }

    if (!payload.titulo.trim() || !payload.autor.trim() || payload.quantidadeTotal < 0) {
      setErro('Preencha titulo, autor e uma quantidade valida.')
      return
    }

    try {
      setErro('')
      setSalvando(true)
      if (id) {
        await put(`/livros/${id}`, payload)
      } else {
        await post('/livros', payload)
      }
      navigate('/livros')
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <h1>{id ? 'Editar Livro' : 'Novo Livro'}</h1>
      {erro && <p className="alert">{erro}</p>}
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Titulo</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Autor</label>
          <input name="autor" value={form.autor} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>ISBN</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Quantidade total</label>
          <input type="number" name="quantidadeTotal" min="0" value={form.quantidadeTotal} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
      </form>
    </div>
  )
}
