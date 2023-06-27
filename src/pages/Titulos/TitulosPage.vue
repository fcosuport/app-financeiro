<template>
  <q-page padding>
    <div class="row">
    <q-table
      dense
      title="Titulos"
      :rows="titulos"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="id"
      class="col-12"
    >
    <template v-slot:top>
      <div class="col-12">
        <div class="row q-gutter-sm justify-between">
          <div>
            <span class="text-h6 q-mr-lg">Nº Titulos: {{ titulos.length }}</span>
            <q-chip color="blue" text-color="white" class="q-mr-sm">
              Valor Total: {{ titulostotal }}
            </q-chip>
            <q-chip color="green" text-color="white" class="q-mr-sm">
              Valor Pago: {{ titulospago }}
            </q-chip>
            <q-chip color="red" text-color="white">
              Valor Aberto: {{ titulosaberto }}
            </q-chip>
          </div>
          <div class="text-right">
            <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadTitulos'}" />
          </div>
        </div>
      </div>
      <div class="col-12 q-mt-sm">
        <q-separator color="primary" inset/>
        <div class="row q-gutter-sm q-mt-lg">
          <q-btn
            dense
            color="secondary"
            icon-right="filter_alt"
            label="Filtrar"
            @click="getTitulos()"
          />
          <q-select
            outlined
            dense
            use-input
            v-model="selectedcliente"
            :options="optionsCliente"
            map-options
            emit-value
            @filter="filterFn"
            option-value="id"
            option-label="razao"
            label="Cliente"
            style="width: 400px"
            class="q-ml-xl"
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
            dense
            options-dense
            v-model="formapagamento"
            :options="optionsFormaPagamento"
            label="Forma Pagamento"
            style="width: 150px"
            class="q-ml-sm"
          >
            <template v-slot:append>
              <q-icon
              v-if="formapagamento.value !== ''"
              name="close"
              @click.stop.prevent="formapagamento = {label: 'Todos', value: 0 }"
              class="cursor-pointer" />
            </template>
          </q-select>
          <q-select
            outlined
            dense
            options-dense
            v-model="status"
            :options="optionsStatus"
            map-options
            emit-value
            label="Status"
            style="width: 100px"
            class="q-mr-sm"
          />
          <q-input
            outlined
            dense
            label="Nº Parcela"
            type="number"
            v-model="numparcela"
            min="0"
            style="width: 100px"
            class="q-mr-sm"
          />
        </div>
      </div>
    </template>
      <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-badge rounded
          :color="props.row.status == 'ABERTO' ? 'red' : 'primary'"
          :label="props.row.status == 'ABERTO' ? 'ABERTO' : 'PAGO'"
        />
      </q-td>
    </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn
              icon="edit"
              color="secondary"
              dense
              size="sm"
              @click="alterarTitulos(props.row.id)"
            >
              <q-tooltip class="bg-teal-4" anchor="top middle" self="center middle">
                Alterar
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              color="red"
              dense
              size="sm"
              :disabled="props.row.status === 'PAGO' ? true : false"
              @click="cancelarTitulos(props.row.id)"
            >
              <q-tooltip class="bg-red" anchor="top middle" self="center middle">
                Excluir
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import titulosService from 'src/Services/Titulos'
import clientesService from 'src/Services/Clientes'
import formaPagamentoService from 'src/Services/FormasPagamento'
import { useRouter } from 'vue-router'
import { useQuasar, date } from 'quasar'

export default defineComponent({
  name: 'TitulosPage',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const stringOptions = ref([])
    const optionsCliente = ref([])
    const selectedcliente = ref('')
    const cliente = ref(0)
    const numparcela = ref(0)
    const titulos = ref([])
    const optionsFormaPagamento = ref([])
    const formapagamento = ref({ label: 'Todos', value: 0 })
    const status = ref('Todos')
    const optionsStatus = ['Todos', 'PAGO', 'ABERTO']
    const { listarComFiltros: listarTitulos, cancelar } = titulosService()
    const { listar: listarClientes } = clientesService()
    const { listar: listarFormasPagamento } = formaPagamentoService()

    const pagination = ref({
      page: 1,
      rowsPerPage: 20
    })

    const columns = [
      { name: 'id', field: 'id', label: 'Titulo', align: 'left', sortable: true },
      { name: 'emissao', field: 'emissao', label: 'Emissão', format: val => date.formatDate(val, 'DD/MM/YYYY'), align: 'left', sortable: true },
      { name: 'clienteRazao', field: 'clienteRazao', label: 'Razão Social', align: 'left', sortable: true },
      { name: 'vencimento', field: 'vencimento', label: 'Vencimento', format: val => date.formatDate(val, 'DD/MM/YYYY'), align: 'left', sortable: true },
      { name: 'valor', field: 'valor', label: 'Valor', format: (val) => val.toFixed(2), align: 'left', sortable: true },
      { name: 'status', field: 'status', label: 'Status', align: 'left', sortable: true },
      { name: 'numParcela', field: 'numParcela', label: 'Nº Parcela', align: 'center', sortable: true },
      { name: 'dtPagamento', field: 'dtPagamento', label: 'Pagamento', format: (val) => (val !== '0001-01-01T00:00:00' ? date.formatDate(val, 'DD/MM/YYYY') : ''), align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    // const titulospago = computed(() => titulos.value.filter(titulo => titulo.status === 'PAGO'))
    // const titulosaberto = computed(() => titulos.value.filter(titulo => titulo.status === 'ABERTO'))

    const titulostotal = computed(() => {
      const total = titulos.value.reduce((total, titulo) => {
        return total + titulo.valor
      }, 0)
      return total.toFixed(2)
    })

    const titulospago = computed(() => {
      const totalPago = titulos.value.reduce((total, titulo) => {
        if (titulo.status === 'PAGO') {
          return total + titulo.valor
        }
        return total
      }, 0)
      return totalPago.toFixed(2)
    })

    const titulosaberto = computed(() => {
      const totalAberto = titulos.value.reduce((total, titulo) => {
        if (titulo.status === 'ABERTO') {
          return total + titulo.valor
        }
        return total
      }, 0)
      return totalAberto.toFixed(2)
    })

    onMounted(() => {
      getClientes()
      getFormasPagamentos()
    })

    const getTitulos = async () => {
      try {
        cliente.value = 0
        if (selectedcliente.value > 0) {
          cliente.value = selectedcliente.value
        }

        if (numparcela.value === null || (numparcela.value === '')) {
          numparcela.value = 0
        }

        const filtros = `cliente=${cliente.value}&formapagamento=${formapagamento.value.value}&status=${status.value}&numparcela=${numparcela.value}`
        const data = await listarTitulos(filtros)
        titulos.value = data
      } catch (error) {
        console.error(error)
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

    const getFormasPagamentos = async () => {
      try {
        const data = await listarFormasPagamento()
        optionsFormaPagamento.value = data.map((formapagamento) => {
          return {
            value: formapagamento.id,
            label: formapagamento.descricao
          }
        })
      } catch (error) {
        console.error(error)
      }
    }

    const alterarTitulos = (id) => {
      router.push({ name: 'CadTitulos', params: { id } })
    }

    const cancelarTitulos = (id) => {
      try {
        $q.dialog({
          title: 'Cancelar',
          // message: `Deseja realmente cancelar a assinatura ${columns.name} ?`,
          message: 'Deseje realmente excluir o Titulo?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await cancelar(id)
          $q.notify({ message: 'Titulo excluido com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
          getTitulos()
        }).onOk(() => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      } catch (error) {
        console.error('erro', error)
      }
    }

    return {
      getTitulos,
      titulos,
      columns,
      alterarTitulos,
      cancelarTitulos,
      pagination,
      titulostotal,
      titulospago,
      titulosaberto,
      optionsFormaPagamento,
      formapagamento,
      optionsStatus,
      status,
      selectedcliente,
      optionsCliente,
      stringOptions,
      cliente,
      numparcela,

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
