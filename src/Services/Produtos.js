import useApi from 'src/Composables/UseApi'

export default function produtosService () {
  const { listar, selecionarId, cadastrar, alterar } = useApi('produto')

  return {
    listar,
    selecionarId,
    cadastrar,
    alterar
  }
}
