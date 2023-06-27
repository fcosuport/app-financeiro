import useApi from 'src/Composables/UseApi'

export default function assinaturasService () {
  const { listar, listarComFiltros, selecionarId, cadastrar, alterar, cancelar } = useApi('assinatura')

  return {
    listar,
    listarComFiltros,
    selecionarId,
    cadastrar,
    alterar,
    cancelar
  }
}
