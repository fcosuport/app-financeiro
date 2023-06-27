<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Cadastro de Produtos
        </p>
      </div>
      <q-form class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md" @submit="onSubmit">
        <q-input
          disable
          label="Código"
          v-model="form.id"
        />
        <q-input
          label="Descrição"
          v-model="form.descricao"
          :rules="[val => (val && val.length > 0) || 'Descrição é Obrigatório']"
        />
        <q-input
          label="Valor"
          type="number"
          v-model="form.valor"
          :rules="[val => (val !== null && val !== '') || 'Valor é Obrigatório', val => (val > 0) || 'Valor não pode ser zero']"
        />

        <q-btn
          label="Salvar"
          color="green"
          class="full-width"
          type="submit"
        />

        <q-btn
          label="Cancelar"
          color="red"
          class="full-width"
          outline
          :to="{ name: 'ProdutosPage'}"
        />

      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import produtosService from 'src/Services/Produtos'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'CadProdutos',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { cadastrar, selecionarId, alterar } = produtosService()

    const form = ref({
      descricao: '',
      valor: ''
    })

    onMounted(() => {
      if (route.params.id) {
        selecionarProduto(route.params.id)
      }
    })

    const selecionarProduto = async (id) => {
      try {
        const response = await selecionarId(id)
        form.value = response
      } catch (error) {
        $q.notify({ message: 'Erro ao Buscar os Dados!', icon: 'block', type: 'negative', color: 'negative' })
      }
    }

    const onSubmit = async () => {
      try {
        if (form.value.id) {
          await alterar(form.value)
        } else {
          await cadastrar(form.value)
        }
        $q.notify({ message: 'Registro Salvo com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
        router.push({ name: 'ProdutosPage' })
      } catch (error) {
        console.error(error)
      }
    }

    return {
      form,
      onSubmit
    }
  }
})
</script>
