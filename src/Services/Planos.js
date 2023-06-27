import useApi from 'src/Composables/UseApi'

export default function planosService () {
  const { listar, selecionarId, cadastrar, alterar } = useApi('plano')

  return {
    listar,
    selecionarId,
    cadastrar,
    alterar
  }
}
