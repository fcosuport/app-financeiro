<template>
  <q-page padding>
    <div class="container">
      <p class="text-h6">
        Cadastro de Clientes
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
        <q-input
          outlined
          label="Razão Social"
          v-model="form.razao"
          class="col-md-5 col-xs-12 col-sm-12"
          :rules="[val => (val && val.length > 0) || 'Razão Social é Obrigatório']"
        />
        <q-input
          outlined
          label="Fantasia"
          v-model="form.fantasia"
          class="col-md-5 col-xs-12 col-sm-12"
          :rules="[val => (val && val.length > 0) || 'Fantasia é Obrigatório']"
        />
        <q-input
          outlined
          label="Cnpj / Cpf"
          v-model="form.cnpj_Cpf"
          :mask="'##.###.###/####-##'"
          class="col-md-3 col-xs-12 col-sm-12"
          :rules="[val => (val && val.length > 0) || 'Cnpj/Cpf é Obrigatório']"
        />
        <q-input
          outlined
          label="Telefone"
          v-model="form.telefone"
          class="col-md-3 col-xs-12 col-sm-12"
          :rules="[val => (val && val.length > 0) || 'Telefone é Obrigatório']"
        />
        <q-input
          outlined
          label="E-mail"
          v-model="form.email"
          class="col-md-6 col-xs-12 col-sm-12"
        />
        <q-input
          outlined
          label="Observação"
          type="textarea"
          v-model="form.obs"
          class="col-md-4 col-xs-12 col-sm-12"
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
          label="Data Alteração"
          v-model="form.dtalteracao"
          class="col-md-2 col-xs-12 col-sm-12"
        />
        <div>
          <q-checkbox
            label="Inativo"
            color="red"
            v-model="form.inativo"
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
              :to="{ name: 'ClientesPage'}"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import clientesService from 'src/Services/Clientes'
import { useQuasar, date } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'CadClientes',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { cadastrar, selecionarId, alterar } = clientesService()

    const form = ref({
      razao: '',
      fantasia: '',
      cnpj_Cpf: '',
      telefone: '',
      email: '',
      obs: '',
      inativo: false,
      dtcadastro: null,
      dtalteracao: null
    })

    onMounted(() => {
      if (route.params.id) {
        selecionarCliente(route.params.id)
      }
    })

    const selecionarCliente = async (id) => {
      try {
        const response = await selecionarId(id)
        form.value = response
        form.value.dtcadastro = date.formatDate(form.value.dtcadastro, 'DD/MM/YYYY HH:mm:ss')
        form.value.dtalteracao = date.formatDate(form.value.dtalteracao, 'DD/MM/YYYY HH:mm:ss')
      } catch (error) {
        $q.notify({ message: 'Erro ao Buscar os Dados!', icon: 'block', type: 'negative', color: 'negative' })
      }
    }

    const onSubmit = async () => {
      try {
        if (form.value.id) {
          const dados = {
            id: form.value.id,
            razao: form.value.razao,
            fantasia: form.value.fantasia,
            cnpj_Cpf: form.value.cnpj_Cpf,
            telefone: form.value.telefone,
            email: form.value.email,
            obs: form.value.obs,
            inativo: form.value.inativo
          }
          await alterar(dados)
        } else {
          const dados = {
            razao: form.value.razao,
            fantasia: form.value.fantasia,
            cnpj_Cpf: form.value.cnpj_Cpf,
            telefone: form.value.telefone,
            email: form.value.email,
            obs: form.value.obs,
            inativo: form.value.inativo
          }
          await cadastrar(dados)
        }
        $q.notify({ message: 'Registro Salvo com Sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
        router.push({ name: 'ClientesPage' })
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
