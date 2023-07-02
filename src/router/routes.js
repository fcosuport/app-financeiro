const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/Usuarios/LoginPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Usuarios/LoginPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', name: 'DashboardPage', component: () => import('pages/DashboardPage.vue') },
      { path: 'titulos', name: 'TitulosPage', component: () => import('pages/Titulos/TitulosPage.vue') },
      { path: 'cadtitulos', name: 'CadTitulos', component: () => import('pages/Titulos/CadTitulos.vue') },
      { path: 'titulos/:id?', name: 'AltTitulos', component: () => import('pages/Titulos/AltTitulos.vue') },
      { path: 'assinaturas', name: 'AssinaturasPage', component: () => import('pages/Assinaturas/AssinaturasPage.vue') },
      { path: 'assinaturas/:id?', name: 'CadAssinaturas', component: () => import('pages/Assinaturas/CadAssinaturas.vue') },
      { path: 'clientes', name: 'ClientesPage', component: () => import('pages/Clientes/ClientesPage.vue') },
      { path: 'clientes/:id?', name: 'CadClientes', component: () => import('pages/Clientes/CadClientes.vue') },
      { path: 'produtos', name: 'ProdutosPage', component: () => import('pages/Produtos/ProdutosPage.vue') },
      { path: 'produtos/:id?', name: 'CadProdutos', component: () => import('pages/Produtos/CadProdutos.vue') },
      { path: 'planos', name: 'PlanosPage', component: () => import('pages/Planos/PlanosPage.vue') },
      { path: 'planos/:id?', name: 'CadPlanos', component: () => import('pages/Planos/CadPlanos.vue') },
      { path: 'formaspagamento', name: 'FormasPagamentoPage', component: () => import('pages/FormasPagamento/FormasPagamentoPage.vue') },
      { path: 'cadformaspagamento/:id?', name: 'CadFormasPagamento', component: () => import('pages/FormasPagamento/CadFormasPagamento.vue') }
    ],
    meta: { requiresAuth: true }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
