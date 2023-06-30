import useApi from 'src/Composables/UseApi'

export default function usuariosService () {
  const { logar } = useApi('auth')

  return {
    logar
  }
}
