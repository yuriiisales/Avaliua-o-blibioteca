import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post, put } from '../services/api'

export default function FormLivro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ titulo: '', autor: '', isbn: '', quantidadeTotal: 1 })

  useEffect(() => {
    if (id) {
      get(`/livros/${id}`).then(setForm)
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      quantidadeTotal: Number(form.quantidadeTotal),
    }

    if (!payload.titulo.trim() || !payload.autor.trim() || payload.quantidadeTotal < 0) {
      return
    }

    if (id) {
      put(`/livros/${id}`, payload).then(() => navigate('/livros'))
    } else {
      post('/livros', payload).then(() => navigate('/livros'))
    }
  }

  return (
    <div>
      <h1>{id ? 'Editar Livro' : 'Novo Livro'}</h1>
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
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
