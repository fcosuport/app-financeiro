<template>
  <q-page padding>
    <div class="container">
      <p class="text-h6">
        Cadastro de Titulos
      </p>
      <br>
      <q-form @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <q-select
            outlined
            use-input
            v-model="selectedcliente"
            :options="optionsCliente"
            map-options
            emit-value
            @filter="filterFn"
            option-value="id"
            option-label="razao"
            label="Cliente"
            class="col-md-8  col-xs-12 col-sm-12"
            :rules="[val => (val !== null && val !== '') || 'Cliente é Obrigatório']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhum Resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedFormaPagamento"
            :options="optionsFormasPagamento"
            map-options
            emit-value
            option-value="id"
            option-label="descricao"
            label="Pagamento"
            class="col-md-3 col-xs-12 col-sm-12"
            :rules="[ val => val && val!=='' || 'Forma de Pagamento é obrigatório']"
          />
          <q-input
            outlined
            label="Qtde de Parcelas"
            type="number"
            v-model="form.qtdeParcelas"
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
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CadTitulos',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const { cadastrar } = TitulosService()
    const { listar: listarClientes } = clientesService()
    const { listar: listarFormasPagamento } = formaPagamentoService()

    const stringOptions = ref([])
    const optionsCliente = ref([])
    const selectedcliente = ref('')
    const optionsFormasPagamento = ref([])
    const selectedFormaPagamento = ref('')

    const form = ref({
      clienteId: null,
      formaPagamentoId: null,
      qtdeParcelas: '',
      valor: '',
      emissao: '',
      vencimento: ''
    })

    onMounted(() => {
      getFormasPagamentos()
      getClientes()
    })

    const getClientes = async () => {
      try {
        const data = await listarClientes()
        stringOptions.value = data
        optionsCliente.value = stringOptions.value
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
          clienteId: selectedcliente.value,
          formapagamentoId: selectedFormaPagamento.value,
          qtdeParcelas: form.value.qtdeParcelas,
          valor: form.value.valor,
          emissao: dtemissao,
          vencimento: dtvencimento
        }
        await cadastrar(dados)

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
      onSubmit,

      filterFn (val, update) {
        if (val.length < 2) {
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          optionsCliente.value = stringOptions.value.filter(option => option.razao.toLowerCase().includes(needle))
        })
      }
    }
  }
})
</script>
