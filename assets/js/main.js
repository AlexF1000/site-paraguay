/**
 * PORTAL PARAGUAI PRIME - MAIN SCRIPTS
 * Navegação, Interatividade, Modais de Conversão e Lead Generation
 */

// Configuração Oficial de Atendimento e Consultas
const CONTATO_CONFIG = {
  email: "contato@paraguayprime.online",
  phone: "5548998404830", 
  formatted: "+55 (48) 99840-4830",
  defaultMessage: "Olá! Vim pelo Portal Paraguai Prime e gostaria de mais informações."
};
const WHATSAPP_CONFIG = CONTATO_CONFIG; // Retrocompatibilidade

function abrirWhatsApp(motivo, detalhes = "") {
  let texto = `Olá! Encontrei o Portal Paraguai Prime e tenho interesse em:\n\n*Assunto:* ${motivo}`;
  if (detalhes) {
    texto += `\n*Detalhes:* ${detalhes}`;
  }
  texto += `\n\nPoderiam me orientar sobre os próximos passos?`;
  
  const url = `https://wa.me/${CONTATO_CONFIG.phone}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function enviarEmailConsulta(assunto, corpo = "") {
  const subject = encodeURIComponent(assunto || 'Consulta - Portal Paraguai Prime');
  const body = encodeURIComponent(corpo || 'Olá! Gostaria de mais informações sobre os serviços do Paraguai Prime.');
  window.location.href = `mailto:${CONTATO_CONFIG.email}?subject=${subject}&body=${body}`;
}

// Controle do Modal de Contato com Especialistas
function abrirModalEspecialista(categoria = 'Geral') {
  const modal = document.getElementById('modalEspecialista');
  const catInput = document.getElementById('modalCategoria');
  if (catInput) catInput.value = categoria;
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    abrirWhatsApp(categoria);
  }
}

function fecharModalEspecialista() {
  const modal = document.getElementById('modalEspecialista');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Submissão do Formulário de Lead / Conexão com Parceiro
function enviarLeadForm(event) {
  event.preventDefault();
  const nome = document.getElementById('leadNome').value;
  const emailEl = document.getElementById('leadEmail');
  const email = emailEl ? emailEl.value : '';
  const whatsapp = document.getElementById('leadWhatsapp').value;
  const interesseEl = document.getElementById('leadInteresse');
  const interesse = interesseEl ? interesseEl.value : 'Geral';
  const perfilEl = document.getElementById('leadPerfil');
  const perfil = perfilEl ? perfilEl.value : '';

  const detalhes = `Nome: ${nome} | E-mail: ${email} | WhatsApp: ${whatsapp} | Perfil: ${perfil}`;
  abrirWhatsApp(`Atendimento Especializado - ${interesse}`, detalhes);
  
  fecharModalEspecialista();
}

// Menu Mobile & Overlay
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('navOverlay');
  if (navMenu && hamburger) {
    const willOpen = !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', willOpen);
    hamburger.classList.toggle('active', willOpen);
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (overlay) overlay.classList.toggle('active', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  }
}

function closeMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('navOverlay');
  if (navMenu) navMenu.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (overlay) overlay.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Fechar modais ao clicar no overlay escuro e fechar menu em cliques de links
window.addEventListener('click', (e) => {
  const modal = document.getElementById('modalEspecialista');
  if (e.target === modal) {
    fecharModalEspecialista();
  }
  const overlay = document.getElementById('navOverlay');
  if (e.target === overlay) {
    closeMobileMenu();
  }
});

// Fechar com tecla ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModalEspecialista();
    closeMobileMenu();
  }
});

// Fechar menu mobile automaticamente ao clicar em links internos
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.nav-links .nav-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Fecha menu se a tela for redimensionada para desktop (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  });
});

