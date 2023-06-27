import useApi from 'src/Composables/UseApi'

export default function titulosService () {
  const { listar, listarComFiltros, selecionarId, cadastrar, alterar, cancelar } = useApi('titulo')

  return {
    listar,
    listarComFiltros,
    selecionarId,
    cadastrar,
    alterar,
    cancelar
  }
}
