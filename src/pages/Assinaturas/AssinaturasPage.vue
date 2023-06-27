<template>
  <q-page padding>
    <div class="row">
    <q-table
      title="Assinaturas"
      :rows="assinaturas"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="id"
      class="col-12"
    >
    <template v-slot:top>
      <div class="col-12">
        <div class="row q-gutter-sm justify-between">
          <div>
            <span class="text-h6 q-mr-lg">Assinaturas: {{ assinaturas.length }}</span>
            <q-badge rounded color="blue" class="q-mr-sm">
              Assinaturas Ativas {{ assinaturasAtivas.length }}
            </q-badge>
            <q-badge rounded color="red">
              Assinaturas Inativas {{ assinaturasInativas.length }}
            </q-badge>
          </div>
          <div class="text-right">
            <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadAssinaturas'}" />
          </div>
        </div>
      </div>
      <div class="col-12 q-mt-sm">
        <q-separator color="primary" inset/>
        <div class="row q-gutter-sm q-mt-lg">
          <q-input outlined dense v-model="cliente" label="Cliente" />
          <q-btn dense color="secondary" icon-right="filter_alt" label="Filtrar" @click="getAssinatura()" />
          <q-select
            outlined
            dense
            options-dense
            v-model="produto"
            :options="optionsProduto"
            label="Produto"
            style="width: 220px"
            class="q-ml-xl"
          >
            <template v-slot:append>
              <q-icon
              v-if="produto.value !== ''"
              name="close"
              @click.stop.prevent="produto = {label: 'Todos', value: 0 }"
              class="cursor-pointer" />
            </template>
          </q-select>
          <q-select
            outlined
            dense
            options-dense
            v-model="plano"
            :options="optionsPlano"
            label="Plano"
            style="width: 150px"
            class="q-ml-sm"
          >
            <template v-slot:append>
              <q-icon
              v-if="plano.value !== ''"
              name="close"
              @click.stop.prevent="plano = {label: 'Todos', value: 0 }"
              class="cursor-pointer" />
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
            label="Situação"
            style="width: 100px"
            class="q-mr-sm"
          />
        </div>
      </div>
    </template>
      <template v-slot:body-cell-cancelado="props">
      <q-td :props="props">
        <q-badge rounded
          :color="props.row.cancelado ? 'red' : 'primary'"
          :label="props.row.cancelado ? 'Inativa' : 'Ativa'"
        />
      </q-td>
    </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn
              icon="edit"
              color="secondary"
              dense
              :disable="props.row.cancelado"
              @click="alterarAssinaturas(props.row.id)"
            >
              <q-tooltip class="bg-teal-4" anchor="top middle" self="center middle">
                Alterar
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="cancel"
              color="red"
              dense
              :disable="props.row.cancelado"
              @click="cancelarAssinaturas(props.row.id)"
            >
              <q-tooltip class="bg-red" anchor="top middle" self="center middle">
                Cancelar
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
import assinaturasService from 'src/Services/Assinaturas'
import produtosService from 'src/Services/Produtos'
import planosService from 'src/Services/Planos'
import formaPagamentoService from 'src/Services/FormasPagamento'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'AssinatuasPage',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const cliente = ref('')
    const assinaturas = ref([])
    const optionsProduto = ref([])
    const produto = ref({ label: 'Todos', value: 0 })
    const optionsPlano = ref([])
    const plano = ref({ label: 'Todos', value: 0 })
    const optionsFormaPagamento = ref([])
    const formapagamento = ref({ label: 'Todos', value: 0 })
    const status = ref('Todos')
    const optionsStatus = ['Todos', 'Ativa', 'Inativa']
    /* const optionsStatus = [
      { label: 'Todos', value: '' },
      { label: 'Ativa', value: 'F' },
      { label: 'Inativa', value: 'T' }
    ] */
    // const { listar } = assinaturasService()
    // const { listar } = produtosService()
    const { listarComFiltros: listarAssinaturas, cancelar } = assinaturasService()
    const { listar: listarProdutos } = produtosService()
    const { listar: listarPlanos } = planosService()
    const { listar: listarFormasPagamento } = formaPagamentoService()

    const pagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const columns = [
      { name: 'id', field: 'id', label: 'Cód', align: 'left', sortable: true },
      { name: 'clienteRazao', field: 'clienteRazao', label: 'Razão Social', align: 'left', sortable: true },
      { name: 'produtoDescricao', field: 'produtoDescricao', label: 'Produto', align: 'left', sortable: true },
      { name: 'planoDescricao', field: 'planoDescricao', label: 'Plano', align: 'left', sortable: true },
      { name: 'formaPagamentoDescricao', field: 'formaPagamentoDescricao', label: 'Pagamento', align: 'left', sortable: true },
      { name: 'diaVencimento', field: 'diaVencimento', label: 'Dia Venc', align: 'left', sortable: true },
      { name: 'valor', field: 'valor', label: 'Valor', format: (val) => val.toFixed(2), align: 'left', sortable: true },
      { name: 'cancelado', field: 'cancelado', label: 'Status', align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    const assinaturasAtivas = computed(() => assinaturas.value.filter(assinatura => !assinatura.cancelado))
    const assinaturasInativas = computed(() => assinaturas.value.filter(assinatura => assinatura.cancelado))

    onMounted(() => {
      // getAssinatura()
      getProdutos()
      getPlanos()
      getFormasPagamentos()
    })

    const getAssinatura = async () => {
      try {
        const filtros = `cliente=${cliente.value}&produto=${produto.value.value}&plano=${plano.value.value}&formapagamento=${formapagamento.value.value}&status=${status.value}`
        // const filtros = `cliente=${cliente.value}`
        const data = await listarAssinaturas(filtros)
        assinaturas.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const getProdutos = async () => {
      try {
        const data = await listarProdutos()
        // produtos.value = data
        optionsProduto.value = data.map((produto) => {
          return {
            value: produto.id,
            label: produto.descricao
          }
        })
      } catch (error) {
        console.error(error)
      }
    }

    const getPlanos = async () => {
      try {
        const data = await listarPlanos()
        optionsPlano.value = data.map((plano) => {
          return {
            value: plano.id,
            label: plano.descricao
          }
        })
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

    const alterarAssinaturas = (id) => {
      router.push({ name: 'CadAssinaturas', params: { id } })
    }

    const cancelarAssinaturas = (id) => {
      try {
        $q.dialog({
          title: 'Cancelar',
          // message: `Deseja realmente cancelar a assinatura ${columns.name} ?`,
          message: 'Deseje realmente cancelar a Assinatura?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await cancelar(id)
          $q.notify({ message: 'Assinatura cancelada com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
          getAssinatura()
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
      getAssinatura,
      assinaturas,
      columns,
      alterarAssinaturas,
      cancelarAssinaturas,
      pagination,
      assinaturasAtivas,
      assinaturasInativas,
      optionsProduto,
      produto,
      optionsPlano,
      plano,
      optionsFormaPagamento,
      formapagamento,
      optionsStatus,
      status,
      cliente
    }
  }
})
</script>
