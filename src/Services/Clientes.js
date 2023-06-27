import useApi from 'src/Composables/UseApi'

export default function clientesService () {
  const { listar, selecionarId, cadastrar, alterar } = useApi('cliente')

  return {
    listar,
    selecionarId,
    cadastrar,
    alterar
  }
}
