<template>
  <q-page padding>
    <div class="row">
    <q-table
      title="Formas de Pagamento"
      :rows="formaspagamento"
      :columns="columns"
      row-key="id"
      class="col-12"
    >
      <template v-slot:top>
        <span class="text-h6">Formas de Pagamento</span>
        <q-space/>
        <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadFormasPagamento'}"/>
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" color="secondary" dense @click="alterarFormaPagamento(props.row.id)"/>
          </q-td>
        </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import formaPagamentoService from 'src/Services/FormasPagamento'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'FormasPagamentoPage',
  setup () {
    const router = useRouter()
    const formaspagamento = ref([])
    const { listar } = formaPagamentoService()

    const columns = [
      { name: 'id', field: 'id', label: 'Código', align: 'left', sortable: true },
      { name: 'descricao', field: 'descricao', label: 'Descrição', align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    onMounted(() => {
      getFormasPagamento()
    })

    const getFormasPagamento = async () => {
      try {
        const data = await listar()
        formaspagamento.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const alterarFormaPagamento = (id) => {
      router.push({ name: 'CadFormasPagamento', params: { id } })
    }

    return {
      formaspagamento,
      columns,
      alterarFormaPagamento
    }
  }
})
</script>
