import useApi from 'src/Composables/UseApi'

export default function formaPagamentoService () {
  const { listar, selecionarId, cadastrar, alterar } = useApi('formapagamento')

  return {
    listar,
    selecionarId,
    cadastrar,
    alterar
  }
}
