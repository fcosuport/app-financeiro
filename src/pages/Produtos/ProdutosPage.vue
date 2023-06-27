<template>
  <q-page padding>
    <div class="row">
    <q-table
      title="Produtos"
      :rows="produtos"
      :columns="columns"
      row-key="id"
      class="col-12"
    >
      <template v-slot:top>
        <span class="text-h6">Lista de Produtos</span>
        <q-space/>
        <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadProdutos'}"/>
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" color="secondary" dense @click="alterarProdutos(props.row.id)"/>
          </q-td>
        </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import produtosService from 'src/Services/Produtos'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProdutosPage',
  setup () {
    const router = useRouter()
    const produtos = ref([])
    const { listar } = produtosService()

    const columns = [
      { name: 'id', field: 'id', label: 'Código', align: 'left', sortable: true },
      { name: 'descricao', field: 'descricao', label: 'Descrição', align: 'left', sortable: true },
      { name: 'valor', field: 'valor', label: 'Valor', format: (val) => val.toFixed(2), align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    onMounted(() => {
      getProduto()
    })

    const getProduto = async () => {
      try {
        const data = await listar()
        produtos.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const alterarProdutos = (id) => {
      router.push({ name: 'CadProdutos', params: { id } })
    }

    return {
      produtos,
      columns,
      alterarProdutos
    }
  }
})
</script>
