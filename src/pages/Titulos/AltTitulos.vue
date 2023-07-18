<template>
  <q-page padding>
    <div class="container">
      <p class="text-h6">
        Alteração do Tutulo
      </p>
      <br>
      <q-form @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            outlined
            disable
            label="Nº Titulo"
            v-model="form.id"
            class="col-md-2 col-xs-12 col-sm-12"
          />
          <q-select
            disable
            outlined
            v-model="selectedcliente"
            :options="optionsCliente"
            map-options
            emit-value
            option-value="id"
            option-label="razao"
            label="Cliente"
            class="col-md-7  col-xs-12 col-sm-12"
          />
          <q-select
            outlined
            v-model="selectedFormaPagamento"
            :options="optionsFormasPagamento"
            map-options
            emit-value
            option-value="id"
            option-label="descricao"
            label="Pagamento"
            class="col-md-2 col-xs-12 col-sm-12"
            :rules="[ val => val && val!=='' || 'Forma de Pagamento é obrigatório']"
          />
          <q-input
            outlined
            label="Número da Parcela"
            type="number"
            v-model="form.numParcela"
            class="col-md-2 col-xs-12 col-sm-12"
            :rules="[val => (val !== null && val !== '') || 'Dia Vencimento é Obrigatório', val => (val > 0) || 'Dia Vencimento não pode ser zero']"
          />
          <q-input
            outlined
            label="Valor"
            type="number"
            v-model="form.valor"
            class="col-md-2 col-xs-12 col-sm-12"
            :rules="[val => (val !== null && val !== '') || 'Valor é Obrigatório', val => (val > 0) || 'Valor não pode ser zero']"
          />
          <q-input outlined v-model="form.emissao" mask="##/##/####" label="Emissão">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.emissao" today-btn mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input outlined v-model="form.vencimento" mask="##/##/####" label="Vencimento da 1º">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.vencimento" today-btn mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <br>
        <div class="col-12 column items-left">
          <div class="col q-pa-md q-gutter-lg">
            <q-btn
              label="Salvar"
              color="green"
              icon="save"
              class="float-left"
              type="submit"
            />
            <q-btn
              label="Cancelar"
              color="red"
              class="float-left"
              outline
              :to="{ name: 'TitulosPage'}"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import TitulosService from 'src/Services/Titulos'
import clientesService from 'src/Services/Clientes'
import formaPagamentoService from 'src/Services/FormasPagamento'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'AltTitulos',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { selecionarId, alterar } = TitulosService()
    const { listar: listarClientes } = clientesService()
    const { listar: listarFormasPagamento } = formaPagamentoService()

    const stringOptions = ref([])
    const optionsCliente = ref([])
    const selectedcliente = ref('')
    const optionsFormasPagamento = ref([])
    const selectedFormaPagamento = ref('')

    const form = ref({
      id: null,
      clienteId: null,
      formaPagamentoId: null,
      numParcela: '',
      valor: '',
      emissao: '',
      vencimento: ''
    })

    onMounted(() => {
      if (route.params.id) {
        selecionarTitulo(route.params.id)
      }
      getFormasPagamentos()
      getClientes()
    })

    const selecionarTitulo = async (id) => {
      try {
        const response = await selecionarId(id)
        form.value = response
        const emissaoDateObject = new Date(form.value.emissao)
        const adjustedEmissao = new Date(emissaoDateObject.getTime() + emissaoDateObject.getTimezoneOffset() * 60 * 1000)
        form.value.emissao = adjustedEmissao.toLocaleDateString('pt-BR')
        // form.value.vencimento = date.formatDate(form.value.vencimento, 'DD/MM/YYYY')
        const vencimentoDateObject = new Date(form.value.vencimento)
        const adjustedVencimento = new Date(vencimentoDateObject.getTime() + vencimentoDateObject.getTimezoneOffset() * 60 * 1000)
        // Atribua a data ajustada ao modelo form.vencimento
        form.value.vencimento = adjustedVencimento.toLocaleDateString('pt-BR')
        selectedcliente.value = form.value.clienteId
        selectedFormaPagamento.value = form.value.formaPagamentoId
      } catch (error) {
        $q.notify({ message: 'Erro ao Buscar os Dados!', icon: 'block', type: 'negative', color: 'negative' })
      }
    }

    const getClientes = async () => {
      try {
        const data = await listarClientes()
        optionsCliente.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const getFormasPagamentos = async () => {
      try {
        const data = await listarFormasPagamento()
        optionsFormasPagamento.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const onSubmit = async () => {
      try {
        const emissaoParts = form.value.emissao.split('/')
        const dtemissao = `${emissaoParts[2]}-${emissaoParts[1]}-${emissaoParts[0]}`

        const vencimentoParts = form.value.vencimento.split('/')
        const dtvencimento = `${vencimentoParts[2]}-${vencimentoParts[1]}-${vencimentoParts[0]}`

        const dados = {
          id: form.value.id,
          clienteId: selectedcliente.value,
          formapagamentoId: selectedFormaPagamento.value,
          numParcela: form.value.numParcela,
          valor: form.value.valor,
          emissao: dtemissao,
          vencimento: dtvencimento
        }
        await alterar(dados)

        $q.notify({ message: 'Registro Salvo com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
        router.push({ name: 'TitulosPage' })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      form,
      optionsFormasPagamento,
      selectedFormaPagamento,
      optionsCliente,
      selectedcliente,
      stringOptions,
      onSubmit
    }
  }
})
</script>
