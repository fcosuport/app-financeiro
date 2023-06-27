<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Cadastro de Planos
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
          :to="{ name: 'PlanosPage'}"
        />

      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import planosService from 'src/Services/Planos'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'CadPlanos',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { cadastrar, selecionarId, alterar } = planosService()

    const form = ref({
      descricao: ''
    })

    onMounted(() => {
      if (route.params.id) {
        selecionarPlano(route.params.id)
      }
    })

    const selecionarPlano = async (id) => {
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
        router.push({ name: 'PlanosPage' })
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
