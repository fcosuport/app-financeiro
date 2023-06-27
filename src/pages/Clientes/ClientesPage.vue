<template>
  <q-page padding>
    <div class="row">
    <q-table
      title="Clientes"
      :rows="clientes"
      :columns="columns"
      :filter="filter"
      v-model:pagination="pagination"
      row-key="id"
      class="col-12"
    >
      <template v-slot:top>
        <div class="col-12">
          <span class="text-h6 q-mr-lg">Lista de Clientes</span>
          <q-badge rounded  color="blue" class="q-mr-sm">
            Clientes Ativos {{ clientesAtivos.length }}
          </q-badge>
          <q-badge rounded  color="red">
            Clientes Inativos {{ clientesInativos.length }}
          </q-badge>
        </div>
        <q-input borderless debounce="300" v-model="filter" placeholder="Pesquisar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space/>
        <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadClientes'}"/>
      </template>
      <template v-slot:body-cell-inativo="props">
      <q-td :props="props">
        <q-badge rounded
          :color="props.row.inativo ? 'red' : 'primary'"
          :label="props.row.inativo ? 'Inativo' : 'Ativo'"
        />
      </q-td>
    </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" color="secondary" dense @click="alterarClientes(props.row.id)"/>
          </q-td>
        </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import clientesService from 'src/Services/Clientes'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ClientesPage',
  setup () {
    const router = useRouter()
    const clientes = ref([])
    const { listar } = clientesService()

    const pagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const columns = [
      { name: 'id', field: 'id', label: 'Código', align: 'left', sortable: true },
      { name: 'razao', field: 'razao', label: 'Razão Social', align: 'left', sortable: true },
      { name: 'fantasia', field: 'fantasia', label: 'Fantasia', align: 'left', sortable: true },
      { name: 'cnpj_Cpf', field: 'cnpj_Cpf', label: 'Cnpj/Cpf', align: 'left', sortable: true },
      { name: 'telefone', field: 'telefone', label: 'Telefone', align: 'left', sortable: true },
      { name: 'inativo', field: 'inativo', label: 'Status', align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    const clientesAtivos = computed(() => clientes.value.filter(cliente => !cliente.inativo))
    const clientesInativos = computed(() => clientes.value.filter(cliente => cliente.inativo))

    onMounted(() => {
      getCliente()
    })

    const getCliente = async () => {
      try {
        const data = await listar()
        clientes.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const alterarClientes = (id) => {
      router.push({ name: 'CadClientes', params: { id } })
    }

    return {
      filter: ref(''),
      clientes,
      columns,
      alterarClientes,
      pagination,
      clientesAtivos,
      clientesInativos
    }
  }
})
</script>

<style>
.q-table tbody td {
  font-size: 13px;
}

.q-table thead th {
  font-size: 13px;
}
</style>
