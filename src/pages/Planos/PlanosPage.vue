<template>
  <q-page padding>
    <div class="row">
    <q-table
      title="Planos"
      :rows="planos"
      :columns="columns"
      row-key="id"
      class="col-12"
    >
      <template v-slot:top>
        <span class="text-h6">Lista de Planos</span>
        <q-space/>
        <q-btn color="primary" icon="add" label="Novo" :to="{ name: 'CadPlanos'}"/>
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" color="secondary" dense @click="alterarPlanos(props.row.id)"/>
          </q-td>
        </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import planosService from 'src/Services/Planos'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PlanosPage',
  setup () {
    const router = useRouter()
    const planos = ref([])
    const { listar } = planosService()

    const columns = [
      { name: 'id', field: 'id', label: 'Código', align: 'left', sortable: true },
      { name: 'descricao', field: 'descricao', label: 'Descrição', align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    onMounted(() => {
      getPlano()
    })

    const getPlano = async () => {
      try {
        const data = await listar()
        planos.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const alterarPlanos = (id) => {
      router.push({ name: 'CadPlanos', params: { id } })
    }

    return {
      planos,
      columns,
      alterarPlanos
    }
  }
})
</script>
