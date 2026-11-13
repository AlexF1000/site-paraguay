/**
 * PORTAL PARAGUAI PRIME - MAIN SCRIPTS
 * Navegação, Interatividade, Cotação Automática, Modais e GA4
 */

// Helper para registro de eventos no Google Analytics 4
function registrarEventoGA4(nomeEvento, parametros = {}) {
  if (typeof gtag === 'function') {
    gtag('event', nomeEvento, parametros);
  }
}

// Configuração Oficial de Atendimento e Consultas
const CONTATO_CONFIG = {
  email: "afiuza@verticesm.com",
  phone: "5548998404830", 
  formatted: "+55 (48) 99840-4830",
  defaultMessage: "Olá! Vim pelo Portal Paraguai Prime e gostaria de mais orientações."
};
const WHATSAPP_CONFIG = CONTATO_CONFIG; // Retrocompatibilidade

function abrirWhatsApp(motivo, detalhes = "") {
  registrarEventoGA4('click_whatsapp', { motivo: motivo });

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
  const body = encodeURIComponent(corpo || 'Olá! Gostaria de mais informações sobre o portal.');
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

// Submissão do Formulário de Lead com Validação LGPD
function enviarLeadForm(event) {
  event.preventDefault();

  const consentBox = document.getElementById('leadConsentimento');
  if (consentBox && !consentBox.checked) {
    alert('Por favor, confirme seu consentimento para contato e com a Política de Privacidade antes de prosseguir.');
    return;
  }

  const nome = document.getElementById('leadNome').value;
  const emailEl = document.getElementById('leadEmail');
  const email = emailEl ? emailEl.value : '';
  const whatsapp = document.getElementById('leadWhatsapp').value;
  const interesseEl = document.getElementById('leadInteresse');
  const interesse = interesseEl ? interesseEl.value : 'Geral';
  const perfilEl = document.getElementById('leadPerfil');
  const perfil = perfilEl ? perfilEl.value : '';

  registrarEventoGA4('form_submit', {
    form_name: 'lead_modal',
    interesse: interesse,
    perfil: perfil
  });

  const detalhes = `Nome: ${nome} | E-mail: ${email} | WhatsApp: ${whatsapp} | Perfil: ${perfil}`;
  abrirWhatsApp(`Atendimento - ${interesse}`, detalhes);
  
  fecharModalEspecialista();
}

/**
 * COTAÇÃO AUTOMÁTICA DE CÂMBIO VIA API GRATUITA (BRL, USD, PYG)
 * Legenda obrigatória: "Cotação de referência, atualizada em [data/hora]"
 * Se falhar, oculta o banner para evitar dados antigos.
 */
async function atualizarCotacaoTempoReal() {
  const containerRates = document.querySelector('.topbar-rates');
  const rateBrlEl = document.getElementById('rateBRL');
  const rateUsdEl = document.getElementById('rateUSD');
  const rateLegendEl = document.getElementById('rateLegenda');

  if (!containerRates) return;

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Falha HTTP ao consultar API de câmbio');
    const data = await res.json();

    if (!data || !data.rates || !data.rates.PYG || !data.rates.BRL) {
      throw new Error('Dados de câmbio incompletos');
    }

    const usdToPyg = Math.round(data.rates.PYG);
    const brlToPyg = Math.round(data.rates.PYG / data.rates.BRL);

    if (rateBrlEl) rateBrlEl.innerHTML = `<strong>1 BRL = ${brlToPyg.toLocaleString('pt-BR')} ₲</strong>`;
    if (rateUsdEl) rateUsdEl.innerHTML = `<strong>1 USD = ${usdToPyg.toLocaleString('pt-BR')} ₲</strong>`;

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (rateLegendEl) {
      rateLegendEl.textContent = `Cotação de referência, atualizada em ${dataFormatada}`;
    }
    containerRates.style.display = 'flex';
  } catch (err) {
    console.warn('API de câmbio indisponível. Ocultando banner de cotações para evitar valores desatualizados:', err);
    if (containerRates) {
      containerRates.style.display = 'none';
    }
  }
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
    fecharModalCompraEbook();
    fecharModalPreviaEbook();
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

  // Atualiza cotação em tempo real via API
  atualizarCotacaoTempoReal();

  // Rastreamento GA4 de cliques em botões B2B / Seja Parceiro
  document.querySelectorAll('.btn-b2b, a[href*="para-empresas"]').forEach(el => {
    el.addEventListener('click', () => {
      registrarEventoGA4('click_seja_parceiro', { link_text: el.innerText.trim() });
    });
  });
});


// ==========================================================================
// CONTROLE DO E-BOOK: "O �LTIMO A SAIR APAGUE A LUZ" (R$ 35,00)
// ==========================================================================
function abrirModalCompraEbook() {
  registrarEventoGA4('open_modal_ebook_compra', { item: 'ebook_35' });
  const modal = document.getElementById('modalCompraEbook');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function fecharModalCompraEbook() {
  const modal = document.getElementById('modalCompraEbook');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function abrirModalPreviaEbook() {
  registrarEventoGA4('open_modal_ebook_previa', { item: 'ebook_previa' });
  const modal = document.getElementById('modalPreviaEbook');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function fecharModalPreviaEbook() {
  const modal = document.getElementById('modalPreviaEbook');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function copiarPixEbook() {
  const chavePix = '+5548984294229';
  navigator.clipboard.writeText(chavePix).then(() => {
    const btn = document.getElementById('btnCopiarPixEbook');
    if (btn) {
      const original = btn.innerText;
      btn.innerText = '? Chave Copiada!';
      btn.style.background = '#10B981';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.innerText = original;
        btn.style.background = '#D4AF37';
        btn.style.color = '#0B192C';
      }, 3500);
    }
  }).catch(() => {
    alert('Chave Pix: +5548984294229 (Telefone Celular)');
  });
}

function processarCompraEbook(e) {
  e.preventDefault();
  const nome = document.getElementById('ebookNome')?.value.trim() || '';
  const whats = document.getElementById('ebookWhats')?.value.trim() || '';
  const email = document.getElementById('ebookEmail')?.value.trim() || '';

  registrarEventoGA4('purchase_ebook_intent', { nome: nome, email: email, price: 35.00 });

  // Exibir a caixa de Pix e confirmação dentro do modal
  const formBox = document.getElementById('formCompraEbookArea');
  const pixBox = document.getElementById('pixConfirmacaoEbookArea');
  if (formBox && pixBox) {
    formBox.style.display = 'none';
    pixBox.style.display = 'block';
  }

  // Montar link direto de WhatsApp com dados
  const textoWhats = '*PEDIDO DO E-BOOK: O ÚLTIMO A SAIR APAGUE A LUZ (R$ 35,00)*%0A%0A' +
                     '*Nome:* ' + encodeURIComponent(nome) + '%0A' +
                     '*WhatsApp:* ' + encodeURIComponent(whats) + '%0A' +
                     '*E-mail para Envio:* ' + encodeURIComponent(email) + '%0A%0A' +
                     '_Olá Alex! Acabei de solicitar o e-book no portal Paraguay Prime. Já anotei os dados do Pix no valor de R$ 35,00 e gostaria de confirmar a liberação do meu exemplar em PDF._';
  
  const whatsUrl = 'https://wa.me/5548998404830?text=' + textoWhats;
  
  const btnWhats = document.getElementById('btnWhatsLiberarEbook');
  if (btnWhats) {
    btnWhats.href = whatsUrl;
  }

  // Abre o WhatsApp em nova aba
  window.open(whatsUrl, '_blank');
}
