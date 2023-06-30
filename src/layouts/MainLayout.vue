<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-indigo-10 text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          App Financeiro
        </q-toolbar-title>

        <q-btn-dropdown color="indigo-10" label="Francisco" unelevated>
          <q-list>
            <q-item clickable v-close-popup @click="onSair">
              <q-item-section avatar>
                 <q-avatar icon="logout" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Prático Sistemas
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-expansion-item>
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="playlist_add" color="primary" text-color="white" size="32px" />
          </q-item-section>

          <q-item-section style="font-size: medium;">
            Cadastros Gerais
          </q-item-section>
        </template>

        <q-list>
          <q-item clickable v-ripple exact :to="{ name: 'ProdutosPage'}">
            <q-item-section avatar>
              <q-icon color="primary" name="production_quantity_limits" />
            </q-item-section>
            <q-item-section>Produtos</q-item-section>
          </q-item>
          <q-item clickable v-ripple exact :to="{ name: 'PlanosPage'}">
            <q-item-section avatar>
              <q-icon color="primary" name="calendar_month" />
            </q-item-section>
            <q-item-section>Planos</q-item-section>
          </q-item>
          <q-item clickable v-ripple exact :to="{ name: 'FormasPagamentoPage'}">
            <q-item-section avatar>
              <q-icon color="primary" name="paid" />
            </q-item-section>
            <q-item-section>Formas de Pagamento</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Gráficos e Resumos',
    icon: 'dashboard',
    route: { name: 'DashboardPage' }
  },
  {
    title: 'Boletos/Carnês',
    caption: 'Gestão de Recebimentos',
    icon: 'account_balance',
    route: { name: 'TitulosPage' }
  },
  {
    title: 'Assinaturas',
    caption: 'Gestão de Assinaturas',
    icon: 'receipt_long',
    route: { name: 'AssinaturasPage' }
  },
  {
    title: 'Clientes',
    caption: 'Gestão de Clientes',
    icon: 'people_alt',
    route: { name: 'ClientesPage' }
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)

    const onSair = () => {
      router.replace({ name: 'login' })
    }

    return {
      onSair,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
