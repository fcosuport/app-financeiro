<template>
  <q-page padding>
    <div class="container">
      <p class="text-h6">
        Cadastro de Assinaturas
      </p>
      <br>
      <q-form @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            outlined
            disable
            label="Código"
            v-model="form.id"
            class="col-md-2 col-xs-12 col-sm-12"
          />
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
            class="col-md-9  col-xs-12 col-sm-12"
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
          <!--<q-input
            outlined
            label="Cliente"
            v-model="form.clienteid"
            class="col-md-9  col-xs-12 col-sm-12"
            :rules="[val => (val && val.length > 0) || 'Cliente é Obrigatório']"
          />-->
          <q-select
            outlined
            v-model="selectedProduto"
            :options="optionsProduto"
            map-options
            emit-value
            option-value="id"
            option-label="descricao"
            label="Produto"
            class="col-md-3 col-xs-12 col-sm-12"
            :rules="[ val => val && val!=='' || 'Produto é obrigatório']"
          />
          <q-select
            outlined
            v-model="selectedPlano"
            :options="optionsPlano"
            map-options
            emit-value
            option-value="id"
            option-label="descricao"
            label="Plano"
            class="col-md-2 col-xs-12 col-sm-12"
            :rules="[ val => val && val!=='' || 'Plano é obrigatório']"
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
            label="Dia Vencimento"
            type="number"
            v-model="form.diaVencimento"
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
          <q-input outlined v-model="form.dtPrimeiraParcela" mask="##/##/####" label="Venc da 1º na GN">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.dtPrimeiraParcela" today-btn mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            outlined
            label="Cod Assinatura GN"
            v-model="form.codAssinatura"
            class="col-md-3 col-xs-12 col-sm-12"
          />
          <q-input
            outlined
            label="Nome no Whatsapp"
            v-model="form.nomeWhats"
            class="col-md-5 col-xs-12 col-sm-12"
          />
          <q-input
            outlined
            dense
            disable
            label="Data Cadastro"
            v-model="form.dtcadastro"
            class="col-md-2 col-xs-12 col-sm-12"
          />
          <q-input
            outlined
            dense
            disable
            label="Data Cancelamento"
            v-model="form.dtcancelamento"
            class="col-md-2 col-xs-12 col-sm-12"
          />
          <div>
            <q-checkbox
              disable
              label="Cancelada"
              color="red"
              v-model="form.cancelado"
            />
          </div>
        </div>
        <br>
        <div class="col-12 column items-left">
          <div class="col q-pa-md q-gutter-sm">
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
              :to="{ name: 'AssinaturasPage'}"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import assinaturasService from 'src/Services/Assinaturas'
import clientesService from 'src/Services/Clientes'
import produtosService from 'src/Services/Produtos'
import planosService from 'src/Services/Planos'
import formaPagamentoService from 'src/Services/FormasPagamento'
import { useQuasar, date } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'CadAssinaturas',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { selecionarId, cadastrar, alterar } = assinaturasService()
    const { listar: listarClientes } = clientesService()
    const { listar: listarProdutos } = produtosService()
    const { listar: listarPlanos } = planosService()
    const { listar: listarFormasPagamento } = formaPagamentoService()

    const stringOptions = ref([])
    const optionsCliente = ref([])
    const selectedcliente = ref('')
    const optionsProduto = ref([])
    const selectedProduto = ref('')
    const optionsPlano = ref([])
    const selectedPlano = ref('')
    const optionsFormasPagamento = ref([])
    const selectedFormaPagamento = ref('')

    const form = ref({
      clienteId: null,
      produtoId: null,
      planoId: null,
      formaPagamentoId: null,
      diaVencimento: '',
      valor: '',
      dtPrimeiraParcela: null,
      codAssinatura: '',
      nomeWhats: '',
      dtcadastro: null,
      dtcancelamento: null,
      cancelado: false
    })

    onMounted(() => {
      if (route.params.id) {
        selecionarAssinatura(route.params.id)
      }
      getProdutos()
      getPlanos()
      getFormasPagamentos()
      getClientes()
    })

    const selecionarAssinatura = async (id) => {
      try {
        const response = await selecionarId(id)
        form.value = response
        form.value.dtcadastro = date.formatDate(form.value.dtcadastro, 'DD/MM/YYYY HH:mm:ss')
        form.value.dtPrimeiraParcela = date.formatDate(form.value.dtPrimeiraParcela, 'DD/MM/YYYY')
        if (form.value.cancelado === true) {
          form.value.dtcancelamento = date.formatDate(form.value.dtcancelamento, 'DD/MM/YYYY HH:mm:ss')
        } else {
          form.value.dtcancelamento = null
        }
        // form.value.dtcancelamento = date.formatDate(form.value.dtcancelamento, 'DD/MM/YYYY HH:mm:ss')
        selectedcliente.value = form.value.clienteId
        selectedProduto.value = form.value.produtoId
        selectedPlano.value = form.value.planoId
        selectedFormaPagamento.value = form.value.formaPagamentoId
      } catch (error) {
        $q.notify({ message: 'Erro ao Buscar os Dados!', icon: 'block', type: 'negative', color: 'negative' })
      }
    }

    const getClientes = async () => {
      try {
        const data = await listarClientes()
        stringOptions.value = data
        optionsCliente.value = stringOptions.value
      } catch (error) {
        console.error(error)
      }
    }

    const getProdutos = async () => {
      try {
        const data = await listarProdutos()
        optionsProduto.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const getPlanos = async () => {
      try {
        const data = await listarPlanos()
        optionsPlano.value = data
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
        const dtPrimeiraParcParts = form.value.dtPrimeiraParcela.split('/')
        const dtprimeiraparc = `${dtPrimeiraParcParts[2]}-${dtPrimeiraParcParts[1]}-${dtPrimeiraParcParts[0]}`
        if (form.value.id) {
          const dados = {
            id: form.value.id,
            clienteId: selectedcliente.value,
            produtoId: selectedProduto.value,
            planoId: selectedPlano.value,
            formapagamentoId: selectedFormaPagamento.value,
            diaVencimento: form.value.diaVencimento,
            valor: form.value.valor,
            DtPrimeiraParcela: dtprimeiraparc,
            CodAssinatura: form.value.codAssinatura,
            NomeWhats: form.value.nomeWhats
          }
          await alterar(dados)
        } else {
          const dataatual = new Date()
          const dados = {
            clienteId: selectedcliente.value,
            produtoId: selectedProduto.value,
            planoId: selectedPlano.value,
            formapagamentoId: selectedFormaPagamento.value,
            diaVencimento: form.value.diaVencimento,
            valor: form.value.valor,
            DtPrimeiraParcela: dtprimeiraparc,
            CodAssinatura: form.value.codAssinatura,
            NomeWhats: form.value.nomeWhats,
            dtcadastro: dataatual
          }
          await cadastrar(dados)
        }
        $q.notify({ message: 'Registro Salvo com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
        router.push({ name: 'AssinaturasPage' })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      form,
      optionsProduto,
      selectedProduto,
      optionsPlano,
      selectedPlano,
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
