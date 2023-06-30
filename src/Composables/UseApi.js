import { api } from 'src/boot/axios'

export default function useApi (url) {
  const listar = async () => {
    try {
      const { data } = await api.get(url)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const listarComFiltros = async (filtros) => {
    try {
      const { data } = await api.get(`${url}?${filtros}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const selecionarId = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const cadastrar = async (form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const alterar = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const cancelar = async (id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const logar = async (form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    listar,
    listarComFiltros,
    selecionarId,
    cadastrar,
    alterar,
    cancelar,
    logar
  }
}
