<template>
  <q-page padding class="bg-grey-2">
    <q-form class="row justify-center q-pt-xl" @submit.prevent="Login">
      <div class="col-md-3 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Login</div>
            <div class="text-grey-8">Entre com Usuario e Senha</div>
          </q-card-section>
          <q-card-section>
            <q-input dense outlined v-model="form.nome" label="Usuario"></q-input>
            <q-input dense outlined class="q-mt-md" v-model="form.senha" type="password" label="Senha"></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn
              style="border-radius: 8px;"
              color="indigo-10"
              rounded size="md"
              label="Login"
              no-caps class="full-width"
              type="submit"
            >
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import usuariosService from 'src/Services/Usuarios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const { logar } = usuariosService()
    const router = useRouter()
    const $q = useQuasar()
    const form = ref({
      nome: '',
      senha: ''
    })

    const Login = async () => {
      try {
        await logar(form.value)
        $q.notify({ message: 'Login efetuado com sucesso!', icon: 'check_circle_outline', type: 'positive', color: 'positive', timeout: 500 })
        router.push({ name: 'DashboardPage' })
      } catch (error) {

      }
    }

    return {
      form,
      Login
    }
  }
})
</script>
