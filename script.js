// FluxoDesk - Full SPA Application
const state = {
  currentView: 'landing',
  auth: { user: null, token: null },
  clients: [
    { id: 1, nome: 'Ana Beatriz', email: 'ana@email.com', telefone: '11999998888', ultimoContato: '2024-02-15', status: 'ativo' },
    { id: 2, nome: 'Carlos Silva', email: 'carlos@email.com', telefone: '11988887777', ultimoContato: '2024-02-22', status: 'inativo' },
    { id: 3, nome: 'Mariana Costa', email: 'mariana@email.com', telefone: '11977776666', ultimoContato: '2024-03-01', status: 'ativo' },
    { id: 4, nome: 'João Pereira', email: 'joao@email.com', telefone: '11966665555', ultimoContato: '2024-03-05', status: 'churn' },
    { id: 5, nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '11955554444', ultimoContato: '2024-03-08', status: 'ativo' }
  ],
  agendamentos: [
    { id: 1, cliente: 'Ana Beatriz', servico: 'Corte + Barba', data: '2024-03-20', hora: '10:00', status: 'confirmado' },
    { id: 2, cliente: 'Carlos Silva', servico: 'Hidratação', data: '2024-03-21', hora: '14:30', status: 'pendente' },
    { id: 3, cliente: 'Mariana Costa', servico: 'Manicure', data: '2024-03-22', hora: '09:00', status: 'confirmado' },
    { id: 4, cliente: 'João Pereira', servico: 'Corte', data: '2024-03-23', hora: '16:00', status: 'cancelado' },
    { id: 5, cliente: 'Fernanda Lima', servico: 'Progressiva', data: '2024-03-24', hora: '11:00', status: 'realizado' }
  ],
  pagamentos: [
    { id: 1, cliente: 'Ana Beatriz', valor: 150.00, data: '2024-03-20', status: 'pago' },
    { id: 2, cliente: 'Carlos Silva', valor: 200.00, data: '2024-03-15', status: 'pendente' },
    { id: 3, cliente: 'Mariana Costa', valor: 80.00, data: '2024-03-10', status: 'atrasado' },
    { id: 4, cliente: 'João Pereira', valor: 120.00, data: '2024-03-01', status: 'pago' },
    { id: 5, cliente: 'Fernanda Lima', valor: 250.00, data: '2024-02-28', status: 'atrasado' }
  ],
  tarefas: [
    { id: 1, texto: 'Confirmar agendamentos de amanhã', feito: false },
    { id: 2, texto: 'Enviar lembrete para clientes', feito: false },
    { id: 3, texto: 'Atualizar estoque de produtos', feito: true },
    { id: 4, texto: 'Fechar caixa do dia', feito: false },
    { id: 5, texto: 'Agendar reunião com equipe', feito: false }
  ],
  notificacoes: [
    { id: 1, texto: 'Ana Beatriz confirmou agendamento', lida: false },
    { id: 2, texto: 'Novo cliente cadastrou via WhatsApp', lida: false },
    { id: 3, texto: 'Fatura de Carlos Silva está pendente', lida: true }
  ],
  onboardingPasso: 0,
  config: {
    nome: 'Minha Barbearia',
    email: 'contato@barbearia.com',
    telefone: '11999990000',
    horarioFuncionamento: 'Seg-Sex 08:00-20:00',
    corPrimaria: '#7c3aed',
    notificacoes: true,
    integrarWhatsApp: false
  }
};

// Utility functions
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

function getStatusBadge(status) {
  const map = {
    pago: 'success',
    pendente: 'warning',
    atrasado: 'danger',
    confirmado: 'success',
    cancelado: 'danger',
    realizado: 'info',
    ativo: 'success',
    inativo: 'warning',
    churn: 'danger'
  };
  return `<span class="badge badge-${map[status] || 'info'}">${status.toUpperCase()}</span>`;
}

// Router
function navigate(view) {
  state.currentView = view;
  renderApp();
  renderNav();
  window.scrollTo(0, 0);
}

// Render functions
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div id="navbar" class="fixed top-0 left-0 right-0 z-50 glass"></div>
    <div id="main-content" class="pt-16 min-h-screen">
      ${renderView()}
    </div>
    <div id="modal-container"></div>
    <div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
  `;
  renderNav();
  initNavEvents();
  initViewEvents();
}

function renderNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const isAuth = state.auth.user !== null;
  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('landing')">
          <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FluxoDesk</span>
        </div>
        <div class="hidden md:flex items-center gap-6">
          ${isAuth ? `
            <button onclick="navigate('dashboard')" class="${state.currentView==='dashboard'?'text-primary':'text-gray-300 hover:text-white'} transition">Dashboard</button>
            <button onclick="navigate('clientes')" class="${state.currentView==='clientes'?'text-primary':'text-gray-300 hover:text-white'} transition">Clientes</button>
            <button onclick="navigate('agenda')" class="${state.currentView==='agenda'?'text-primary':'text-gray-300 hover:text-white'} transition">Agenda</button>
            <button onclick="navigate('pagamentos')" class="${state.currentView==='pagamentos'?'text-primary':'text-gray-300 hover:text-white'} transition">Pagamentos</button>
            <button onclick="navigate('config')" class="${state.currentView==='config'?'text-primary':'text-gray-300 hover:text-white'} transition">Config</button>
            <button onclick="logout()" class="btn btn-secondary text-sm">Sair</button>
          ` : `
            <button onclick="navigate('login')" class="text-gray-300 hover:text-white transition">Entrar</button>
            <button onclick="navigate('cadastro')" class="btn btn-primary">Cadastre-se Grátis</button>
          `}
        </div>
        <div class="md:hidden">
          <button id="menu-toggle" class="text-gray-300 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden glass px-4 py-2 space-y-2">
      ${isAuth ? `
        <button onclick="navigate('dashboard')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Dashboard</button>
        <button onclick="navigate('clientes')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Clientes</button>
        <button onclick="navigate('agenda')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Agenda</button>
        <button onclick="navigate('pagamentos')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Pagamentos</button>
        <button onclick="navigate('config')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Config</button>
        <button onclick="logout()" class="block w-full text-left py-2 text-gray-300 hover:text-white">Sair</button>
      ` : `
        <button onclick="navigate('login')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Entrar</button>
        <button onclick="navigate('cadastro')" class="block w-full text-left py-2 text-gray-300 hover:text-white">Cadastre-se</button>
      `}
    </div>
  `;
}

function initNavEvents() {
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    });
  }
}

function renderView() {
  switch(state.currentView) {
    case 'landing': return renderLanding();
    case 'login': return renderLogin();
    case 'cadastro': return renderCadastro();
    case 'recuperar': return renderRecuperar();
    case 'onboarding': return renderOnboarding();
    case 'dashboard': return renderDashboard();
    case 'clientes': return renderClientes();
    case 'agenda': return renderAgenda();
    case 'pagamentos': return renderPagamentos();
    case 'config': return renderConfig();
    default: return renderLanding();
  }
}

function initViewEvents() {
  // Reinitialize after each render
}

// Landing Page
function renderLanding() {
  return `
    <!-- Hero -->
    <section class="relative pt-20 pb-32 px-4 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>
      <div class="max-w-7xl mx-auto text-center relative z-10">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          Gestão inteligente para seu negócio local
        </h1>
        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Agende, gerencie clientes, receba pagamentos e automatize seu negócio com uma plataforma all-in-one.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button onclick="navigate('cadastro')" class="btn btn-primary text-lg px-8 py-3">Começar Grátis</button>
          <button onclick="navigate('login')" class="btn btn-secondary text-lg px-8 py-3">Já tenho conta</button>
        </div>
        <div class="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span>⭐ 4.9 no Google</span>
          <span>🏆 +2.000 clientes</span>
          <span>🔒 99,9% uptime</span>
        </div>
      </div>
    </section>
    <!-- Benefícios -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Por que escolher o FluxoDesk?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card p-8 hover:scale-105 transition-transform">
            <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Agendamento Inteligente</h3>
            <p class="text-gray-400">Calendário integrado com lembretes automáticos para clientes via WhatsApp.</p>
          </div>
          <div class="card p-8 hover:scale-105 transition-transform">
            <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Pagamentos Simples</h3>
            <p class="text-gray-400">Aceite cartões, PIX e boleto. Controle de fluxo de caixa em tempo real.</p>
          </div>
          <div class="card p-8 hover:scale-105 transition-transform">
            <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Métricas Essenciais</h3>
            <p class="text-gray-400">Dashboard completo com KPIs, gráficos de desempenho e relatórios exportáveis.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Planos -->
    <section class="py-20 px-4 bg-gray-900/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Planos que escalam com você</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="card p-8 text-center">
            <h3 class="text-2xl font-bold mb-4">Início</h3>
            <p class="text-4xl font-bold text-primary mb-2">Grátis</p>
            <p class="text-gray-400 mb-6">Para começar</p>
            <ul class="text-left space-y-2 mb-8">
              <li>✓ Até 50 clientes</li>
              <li>✓ Agendamentos ilimitados</li>
              <li>✓ Relatórios básicos</li>
              <li>✗ Integração WhatsApp</li>
              <li>✗ Equipe</li>
            </ul>
            <button onclick="navigate('cadastro')" class="btn btn-primary w-full">Começar Grátis</button>
          </div>
          <div class="card p-8 text-center border-primary/50 scale-105">
            <h3 class="text-2xl font-bold mb-4">Profissional</h3>
            <p class="text-4xl font-bold text-primary mb-2">R$ 67</p>
            <p class="text-gray-400 mb-6">/mês</p>
            <ul class="text-left space-y-2 mb-8">
              <li>✓ Clientes ilimitados</li>
              <li>✓ Agendamentos ilimitados</li>
              <li>✓ Relatórios avançados</li>
              <li>✓ WhatsApp integrado</li>
              <li>✗ Equipe</li>
            </ul>
            <button onclick="navigate('cadastro')" class="btn btn-primary w-full">Assinar</button>
          </div>
          <div class="card p-8 text-center">
            <h3 class="text-2xl font-bold mb-4">Premium</h3>
            <p class="text-4xl font-bold text-primary mb-2">R$ 127</p>
            <p class="text-gray-400 mb-6">/mês</p>
            <ul class="text-left space-y-2 mb-8">
              <li>✓ Tudo do Profissional</li>
              <li>✓ Até 5 membros de equipe</li>
              <li>✓ Automações personalizadas</li>
              <li>✓ Suporte prioritário</li>
              <li>✓ API pública</li>
            </ul>
            <button onclick="navigate('cadastro')" class="btn btn-primary w-full">Assinar</button>
          </div>
        </div>
      </div>
    </section>
    <!-- FAQ -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Perguntas Frequentes</h2>
        <div class="space-y-4">
          <div class="card p-6">
            <h3 class="font-semibold text-lg mb-2">Como funciona o período grátis?</h3>
            <p class="text-gray-400">Você pode usar o plano Início gratuitamente por tempo ilimitado, com recursos limitados. Para testar tudo, ative o trial de 14 dias do plano Profissional sem cartão.</p>
          </div>
          <div class="card p-6">
            <h3 class="font-semibold text-lg mb-2">Posso cancelar quando quiser?</h3>
            <p class="text-gray-400">Sim! Sem multa ou burocracia. Seus dados ficam salvos por 30 dias para reativação.</p>
          </div>
          <div class="card p-6">
            <h3 class="font-semibold text-lg mb-2">Como funciona a integração com WhatsApp?</h3>
            <p class="text-gray-400">Conecte seu número comercial e envie lembretes, confirmações e links de pagamento automaticamente.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer class="border-t border-gray-800 py-12 px-4">
      <div class="max-w-7xl mx-auto text-center text-gray-500 text-sm">
        <p>© 2024 FluxoDesk. Todos os direitos reservados.</p>
        <p class="mt-2">Feito com 💜 para negócios locais do Brasil.</p>
      </div>
    </footer>
  `;
}

// Auth Pages
function renderLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card p-8 w-full max-w-md">
        <h2 class="text-3xl font-bold text-center mb-2">Bem-vindo de volta</h2>
        <p class="text-gray-400 text-center mb-8">Acesse sua conta FluxoDesk</p>
        <form id="login-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" id="login-email" class="input" placeholder="seu@email.com" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Senha</label>
            <input type="password" id="login-senha" class="input" placeholder="********" required>
          </div>
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="rounded bg-gray-800 border-gray-700"> Lembrar-me
            </label>
            <button type="button" onclick="navigate('recuperar')" class="text-primary hover:underline">Esqueceu a senha?</button>
          </div>
          <button type="submit" class="btn btn-primary w-full">Entrar</button>
        </form>
        <p class="text-center mt-6 text-sm text-gray-400">
          Ainda não tem conta? <button onclick="navigate('cadastro')" class="text-primary hover:underline">Cadastre-se</button>
        </p>
      </div>
    </div>
  `;
}

function renderCadastro() {
  return `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card p-8 w-full max-w-md">
        <h2 class="text-3xl font-bold text-center mb-2">Crie sua conta</h2>
        <p class="text-gray-400 text-center mb-8">Teste grátis por 14 dias</p>
        <form id="cadastro-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Nome do negócio</label>
            <input type="text" id="cadastro-nome" class="input" placeholder="Minha Barbearia" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" id="cadastro-email" class="input" placeholder="contato@barbearia.com" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Senha</label>
            <input type="password" id="cadastro-senha" class="input" placeholder="Crie uma senha forte" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Confirmar senha</label>
            <input type="password" id="cadastro-confirmar" class="input" placeholder="Repita a senha" required>
          </div>
          <button type="submit" class="btn btn-primary w-full">Criar conta grátis</button>
        </form>
        <p class="text-center mt-6 text-sm text-gray-400">
          Já tem conta? <button onclick="navigate('login')" class="text-primary hover:underline">Entrar</button>
        </p>
      </div>
    </div>
  `;
}

function renderRecuperar() {
  return `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card p-8 w-full max-w-md">
        <h2 class="text-3xl font-bold text-center mb-2">Recuperar senha</h2>
        <p class="text-gray-400 text-center mb-8">Enviaremos um link para seu email</p>
        <form id="recuperar-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" id="recuperar-email" class="input" placeholder="seu@email.com" required>
          </div>
          <button type="submit" class="btn btn-primary w-full">Enviar link</button>
          <button type="button" onclick="navigate('login')" class="btn btn-secondary w-full">Voltar ao login</button>
        </form>
      </div>
    </div>
  `;
}

// Onboarding
function renderOnboarding() {
  const steps = [
    { titulo: 'Configure seu negócio', desc: 'Dê um nome, horário e cor principal.', icone: '🏪' },
    { titulo: 'Adicione seus serviços', desc: 'Liste os serviços que você oferece.', icone: '💇' },
    { titulo: 'Convide sua equipe', desc: 'Adicione colaboradores (opcional).', icone: '👥' },
    { titulo: 'Conecte pagamentos', desc: 'Integre PIX e cartão.', icone: '💳' },
    { titulo: 'Pronto!', desc: 'Seu FluxoDesk está configurado.', icone: '🎉' }
  ];
  const passo = state.onboardingPasso;
  const step = steps[passo] || steps[0];
  return `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card p-8 w-full max-w-lg text-center">
        <div class="text-6xl mb-4">${step.icone}</div>
        <h2 class="text-2xl font-bold mb-2">${step.titulo}</h2>
        <p class="text-gray-400 mb-8">${step.desc}</p>
        <div class="flex justify-center gap-2 mb-8">
          ${steps.map((_, i) => `<div class="w-3 h-3 rounded-full ${i <= passo ? 'bg-primary' : 'bg-gray-600'}"></div>`).join('')}
        </div>
        <div class="flex gap-4 justify-center">
          ${passo > 0 ? `<button onclick="prevOnboarding()" class="btn btn-secondary">Voltar</button>` : ''}
          <button onclick="${passo < steps.length - 1 ? 'nextOnboarding()' : 'finishOnboarding()'}" class="btn btn-primary">
            ${passo < steps.length - 1 ? 'Próximo' : 'Ir para o Dashboard'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function nextOnboarding() {
  state.onboardingPasso++;
  renderApp();
}

function prevOnboarding() {
  state.onboardingPasso--;
  renderApp();
}

function finishOnboarding() {
  state.onboardingPasso = 0;
  navigate('dashboard');
}

// Dashboard
function renderDashboard() {
  // KPIs
  const totalReceita = state.pagamentos.filter(p => p.status === 'pago').reduce((acc, p) => acc + p.valor, 0);
  const novosClientes = state.clients.filter(c => c.status === 'ativo').length;
  const retencao = Math.round((state.clients.filter(c => c.status === 'ativo').length / state.clients.length) * 100);
  const agendamentosHoje = state.agendamentos.filter(a => a.data === new Date().toISOString().slice(0,10)).length;
  return `
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="kpi"><p class="text-sm text-gray-400">Receita</p><p class="text-2xl font-bold text-green-400">${formatCurrency(totalReceita)}</p></div>
        <div class="kpi"><p class="text-sm text-gray-400">Novos Clientes</p><p class="text-2xl font-bold text-blue-400">${novosClientes}</p></div>
        <div class="kpi"><p class="text-sm text-gray-400">Retenção</p><p class="text-2xl font-bold text-yellow-400">${retencao}%</p></div>
        <div class="kpi"><p class="text-sm text-gray-400">Agendamentos Hoje</p><p class="text-2xl font-bold text-purple-400">${agendamentosHoje}</p></div>
      </div>
      <!-- Gráfico Simulado -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Desempenho Mensal (Receita)</h2>
        <div class="flex items-end gap-2 h-32">
          ${[1200, 2000, 1800, 2500, 2100, 3000, 2800, 3500, 3200, 4000, 3800, 4500].map((val, i) => `
            <div class="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t-md transition-all hover:opacity-80" style="height:${val/4500*100}%"></div>
          `).join('')}
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Tarefas -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Tarefas</h2>
            <button onclick="addTarefa()" class="btn btn-primary text-sm">+ Nova</button>
          </div>
          <ul class="space-y-2">
            ${state.tarefas.map(tarefa => `
              <li class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition">
                <input type="checkbox" ${tarefa.feito ? 'checked' : ''} onchange="toggleTarefa(${tarefa.id})" class="rounded">
                <span class="flex-1 ${tarefa.feito ? 'line-through text-gray-500' : ''}">${tarefa.texto}</span>
                <button onclick="removeTarefa(${tarefa.id})" class="text-red-400 hover:text-red-300">🗑️</button>
              </li>
            `).join('')}
          </ul>
        </div>
        <!-- Notificações -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Notificações</h2>
          <ul class="space-y-2">
            ${state.notificacoes.map(notif => `
              <li class="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 ${notif.lida ? 'opacity-60' : ''}">
                <span class="w-2 h-2 mt-2 rounded-full ${notif.lida ? 'bg-gray-500' : 'bg-primary'}"></span>
                <span class="flex-1 text-sm">${notif.texto}</span>
                <button onclick="marcarLida(${notif.id})" class="text-xs text-gray-500 hover:text-white">✓</button>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Clientes Module
function renderClientes() {
  let html = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 class="text-3xl font-bold">Clientes</h1>
        <div class="flex gap-2">
          <input type="text" id="busca-cliente" placeholder="Buscar cliente..." class="input max-w-xs" oninput="filtrarClientes()">
          <select id="filtro-status" onchange="filtrarClientes()" class="input max-w-[120px]">
            <option value="todos">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="churn">Churn</option>
          </select>
        </div>
      </div>
      <div id="clientes-list" class="space-y-2">
        ${renderClientesList(state.clients)}
      </div>
    </div>
  `;
  return html;
}

function renderClientesList(list) {
  if (list.length === 0) {
    return `<div class="text-center py-16 text-gray-500"><p class="text-4xl mb-4">😕</p><p>Nenhum cliente encontrado</p></div>`;
  }
  return list.map(c => `
    <div class="card p-4 flex items-center justify-between hover:bg-gray-800/50 cursor-pointer" onclick="abrirModalCliente(${c.id})">
      <div>
        <p class="font-semibold">${c.nome}</p>
        <p class="text-sm text-gray-400">${c.email} • ${c.telefone}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">Último contato: ${formatDate(c.ultimoContato)}</span>
        ${getStatusBadge(c.status)}
      </div>
    </div>
  `).join('');
}

function filtrarClientes() {
  const busca = document.getElementById('busca-cliente')?.value.toLowerCase() || '';
  const status = document.getElementById('filtro-status')?.value || 'todos';
  let filtrados = state.clients.filter(c => {
    const matchNome = c.nome.toLowerCase().includes(busca) || c.email.toLowerCase().includes(busca);
    const matchStatus = status === 'todos' || c.status === status;
    return matchNome && matchStatus;
  });
  document.getElementById('clientes-list').innerHTML = renderClientesList(filtrados);
}

function abrirModalCliente(id) {
  const cliente = state.clients.find(c => c.id === id);
  if (!cliente) return;
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick="fecharModal()">
      <div class="card p-8 max-w-md w-full mx-4" onclick="event.stopPropagation()">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">${cliente.nome}</h2>
          <button onclick="fecharModal()" class="text-gray-400 hover:text-white">✕</button>
        </div>
        <div class="space-y-2">
          <p><span class="text-gray-400">Email:</span> ${cliente.email}</p>
          <p><span class="text-gray-400">Telefone:</span> ${cliente.telefone}</p>
          <p><span class="text-gray-400">Último contato:</span> ${formatDate(cliente.ultimoContato)}</p>
          <p><span class="text-gray-400">Status:</span> ${getStatusBadge(cliente.status)}</p>
        </div>
        <div class="mt-6 flex gap-2">
          <button onclick="fecharModal()" class="btn btn-primary flex-1">Editar</button>
          <button onclick="fecharModal(); showToast('Cliente arquivado', 'success')" class="btn btn-secondary flex-1">Arquivar</button>
        </div>
      </div>
    </div>
  `;
}

function fecharModal() {
  document.getElementById('modal-container').innerHTML = '';
}

// Agenda Module
function renderAgenda() {
  const hoje = new Date().toISOString().slice(0,10);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const mes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dataAtual = new Date();
  return `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Agenda</h1>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 card p-6">
          <h2 class="text-xl font-semibold mb-4">${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} de ${mes[dataAtual.getMonth()]}</h2>
          <div class="space-y-2">
            ${state.agendamentos.map(a => `
              <div class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition">
                <div>
                  <p class="font-semibold">${a.cliente}</p>
                  <p class="text-sm text-gray-400">${a.servico} • ${a.hora}</p>
                </div>
                <div class="flex items-center gap-2">
                  ${getStatusBadge(a.status)}
                  <button onclick="alterarStatusAgenda(${a.id})" class="text-xs text-gray-500 hover:text-white">✏️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Ações rápidas</h2>
          <div class="space-y-3">
            <button onclick="showToast('Novo agendamento criado','success')" class="btn btn-primary w-full">+ Novo Agendamento</button>
            <button onclick="showToast('Lista de espera atualizada','info')" class="btn btn-secondary w-full">Lista de Espera</button>
            <button onclick="showToast('Lembretes enviados','success')" class="btn btn-secondary w-full">Enviar Lembretes</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function alterarStatusAgenda(id) {
  const agenda = state.agendamentos.find(a => a.id === id);
  if (!agenda) return;
  const statusMap = ['confirmado', 'pendente', 'cancelado', 'realizado'];
  const idx = statusMap.indexOf(agenda.status);
  agenda.status = statusMap[(idx + 1) % statusMap.length];
  renderApp();
  showToast('Status atualizado', 'success');
}

// Pagamentos Module
function renderPagamentos() {
  const totalPendente = state.pagamentos.filter(p => p.status !== 'pago').reduce((acc, p) => acc + p.valor, 0);
  const totalPago = state.pagamentos.filter(p => p.status === 'pago').reduce((acc, p) => acc + p.valor, 0);
  return `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Pagamentos</h1>
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="kpi"><p class="text-sm text-gray-400">Total Recebido</p><p class="text-2xl font-bold text-green-400">${formatCurrency(totalPago)}</p></div>
        <div class="kpi"><p class="text-sm text-gray-400">A Receber</p><p class="text-2xl font-bold text-yellow-400">${formatCurrency(totalPendente)}</p></div>
      </div>
      <div class="card p-6">
        <div class="space-y-2">
          ${state.pagamentos.map(p => `
            <div class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition">
              <div>
                <p class="font-semibold">${p.cliente}</p>
                <p class="text-sm text-gray-400">${formatDate(p.data)}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-mono">${formatCurrency(p.valor)}</span>
                ${getStatusBadge(p.status)}
                <button onclick="marcarPago(${p.id})" class="text-xs text-gray-500 hover:text-white">💳</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function marcarPago(id) {
  const pag = state.pagamentos.find(p => p.id === id);
  if (pag) {
    pag.status = 'pago';
    renderApp();
    showToast('Pagamento marcado como pago', 'success');
  }
}

// Config Page
function renderConfig() {
  const c = state.config;
  return `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Configurações</h1>
      <div class="space-y-6">
        <!-- Perfil -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Perfil do Negócio</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div><label class="block text-sm mb-1">Nome</label><input id="config-nome" value="${c.nome}" class="input"></div>
            <div><label class="block text-sm mb-1">Email</label><input id="config-email" value="${c.email}" class="input"></div>
            <div><label class="block text-sm mb-1">Telefone</label><input id="config-telefone" value="${c.telefone}" class="input"></div>
            <div><label class="block text-sm mb-1">Horário</label><input id="config-horario" value="${c.horarioFuncionamento}" class="input"></div>
          </div>
          <button onclick="salvarConfig()" class="btn btn-primary mt-4">Salvar</button>
        </div>
        <!-- Equipe -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Equipe</h2>
          <p class="text-gray-400 mb-4">Gerencie os membros da sua equipe.</p>
          <button onclick="showToast('Convide membros pelo email','info')" class="btn btn-primary">+ Convidar</button>
        </div>
        <!-- Preferências -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Preferências</h2>
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span>Notificações por email</span>
              <input type="checkbox" ${c.notificacoes ? 'checked' : ''} onchange="state.config.notificacoes = this.checked" class="rounded">
            </label>
            <label class="flex items-center justify-between">
              <span>Integração WhatsApp</span>
              <input type="checkbox" ${c.integrarWhatsApp ? 'checked' : ''} onchange="state.config.integrarWhatsApp = this.checked" class="rounded">
            </label>
          </div>
        </div>
        <!-- Segurança -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Segurança</h2>
          <div class="space-y-2">
            <button onclick="showToast('Link de troca enviado para seu email','success')" class="btn btn-secondary">Alterar senha</button>
            <button onclick="showToast('Autenticação de dois fatores ativada','success')" class="btn btn-secondary ml-2">Ativar 2FA</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function salvarConfig() {
  state.config.nome = document.getElementById('config-nome').value;
  state.config.email = document.getElementById('config-email').value;
  state.config.telefone = document.getElementById('config-telefone').value;
  state.config.horarioFuncionamento = document.getElementById('config-horario').value;
  showToast('Configurações salvas!', 'success');
}

// Toast system
function showToast(msg, tipo = 'info') {
  const container = document.getElementById('toast-container');
  const colors = { info: 'bg-primary', success: 'bg-green-600', warning: 'bg-yellow-600', danger: 'bg-red-600' };
  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-xl text-white text-sm shadow-lg ${colors[tipo] || 'bg-gray-700'} transform translate-x-full transition-all duration-300`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
    toast.style.transform = 'translateX(0)';
  }, 50);
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Auth actions
function login(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  if (email && senha) {
    state.auth.user = { email, nome: 'Usuário' };
    navigate('onboarding');
    showToast('Login bem-sucedido!', 'success');
  } else {
    showToast('Preencha todos os campos', 'warning');
  }
}

function cadastro(event) {
  event.preventDefault();
  const nome = document.getElementById('cadastro-nome').value;
  const email = document.getElementById('cadastro-email').value;
  const senha = document.getElementById('cadastro-senha').value;
  const confirmar = document.getElementById('cadastro-confirmar').value;
  if (senha !== confirmar) {
    showToast('Senhas não conferem', 'danger');
    return;
  }
  if (nome && email && senha) {
    state.auth.user = { nome, email };
    navigate('onboarding');
    showToast('Conta criada com sucesso!', 'success');
  } else {
    showToast('Preencha todos os campos', 'warning');
  }
}

function recuperar(event) {
  event.preventDefault();
  const email = document.getElementById('recuperar-email').value;
  if (email) {
    showToast('Link enviado para seu email', 'success');
    navigate('login');
  } else {
    showToast('Informe seu email', 'warning');
  }
}

function logout() {
  state.auth.user = null;
  state.onboardingPasso = 0;
  navigate('landing');
  showToast('Você saiu', 'info');
}

// Tarefas
function addTarefa() {
  const texto = prompt('Nova tarefa:');
  if (texto) {
    state.tarefas.push({ id: Date.now(), texto, feito: false });
    renderApp();
    showToast('Tarefa adicionada', 'success');
  }
}

function toggleTarefa(id) {
  const tarefa = state.tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.feito = !tarefa.feito;
    renderApp();
  }
}

function removeTarefa(id) {
  state.tarefas = state.tarefas.filter(t => t.id !== id);
  renderApp();
  showToast('Tarefa removida', 'info');
}

function marcarLida(id) {
  const notif = state.notificacoes.find(n => n.id === id);
  if (notif) {
    notif.lida = true;
    renderApp();
  }
}

// Events binding after each render
function bindEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', login);
  const cadastroForm = document.getElementById('cadastro-form');
  if (cadastroForm) cadastroForm.addEventListener('submit', cadastro);
  const recuperarForm = document.getElementById('recuperar-form');
  if (recuperarForm) recuperarForm.addEventListener('submit', recuperar);
}

// Override renderApp to bind events after render
const originalRenderApp = renderApp;
renderApp = function() {
  originalRenderApp();
  bindEvents();
};

// Initialize app
renderApp();

// Expose functions globally for inline onclick
window.navigate = navigate;
window.logout = logout;
window.filtrarClientes = filtrarClientes;
window.abrirModalCliente = abrirModalCliente;
window.fecharModal = fecharModal;
window.alterarStatusAgenda = alterarStatusAgenda;
window.marcarPago = marcarPago;
window.salvarConfig = salvarConfig;
window.addTarefa = addTarefa;
window.toggleTarefa = toggleTarefa;
window.removeTarefa = removeTarefa;
window.marcarLida = marcarLida;
window.showToast = showToast;
window.nextOnboarding = nextOnboarding;
window.prevOnboarding = prevOnboarding;
window.finishOnboarding = finishOnboarding;