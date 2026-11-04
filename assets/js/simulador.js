/**
 * PORTAL PARAGUAI PRIME - SIMULADORES E INTERATIVIDADE
 * Cálculos fiscais e de custo de vida fundamentados na legislação paraguaia (Ley 6380/19)
 */

// Cotações de referência atualizadas
const COTACAO = {
  BRL_TO_PYG: 1350,   // R$ 1 = ~1.350 Guaranis
  USD_TO_PYG: 7800,   // US$ 1 = ~7.800 Guaranis
  USD_TO_BRL: 5.78,   // US$ 1 = R$ 5,78
};

// Funções utilitárias de formatação
function formatarMoedaBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function formatarMoedaUSD(valor) {
  return valor.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatarGuarani(valor) {
  return 'Gs. ' + Math.round(valor).toLocaleString('es-PY');
}

/**
 * SIMULADOR TRIBUTÁRIO: BRASIL vs. PARAGUAI
 */
function calcularTributos(faturamentoMensal, regimeBrasil = 'lucro_presumido') {
  // Estimativa Brasil
  let aliquotaEfetivaBrasil = 0.165; // Padrão Lucro Presumido Serviços (IRPJ + CSLL + PIS + COFINS + ISS)
  if (regimeBrasil === 'simples_alto') {
    aliquotaEfetivaBrasil = 0.195; // Simples Nacional Anexo V / faixas superiores
  } else if (regimeBrasil === 'clt_executivo') {
    aliquotaEfetivaBrasil = 0.275; // IRPF + INSS teto
  } else if (regimeBrasil === 'comercio') {
    aliquotaEfetivaBrasil = 0.125;
  }

  // No Brasil, além do imposto, há custo de compliance contábil pesado e bi-tributações
  const impostoMensalBrasil = faturamentoMensal * aliquotaEfetivaBrasil;
  const impostoAnualBrasil = impostoMensalBrasil * 12;

  // No Paraguai:
  // Sistema "Triplo 10" (IRE 10% sobre lucro líquido).
  // Com despesas operacionais legítimas (deduções amplas permitidas por lei), a alíquota efetiva média sobre faturamento bruto é de ~8.5% a 10%.
  // Além disso, rendas geradas fora do território paraguaio são ISENTAS (Princípio da Territorialidade estrita).
  const aliquotaEfetivaParaguai = 0.085;
  const impostoMensalParaguai = faturamentoMensal * aliquotaEfetivaParaguai;
  const impostoAnualParaguai = impostoMensalParaguai * 12;

  // Economia
  const economiaMensal = Math.max(0, impostoMensalBrasil - impostoMensalParaguai);
  const economiaAnual = economiaMensal * 12;
  const economiaAnualUSD = economiaAnual / COTACAO.USD_TO_BRL;

  return {
    faturamentoMensal,
    impostoMensalBrasil,
    impostoAnualBrasil,
    aliquotaBrasil: (aliquotaEfetivaBrasil * 100).toFixed(1),
    impostoMensalParaguai,
    impostoAnualParaguai,
    aliquotaParaguai: (aliquotaEfetivaParaguai * 100).toFixed(1),
    economiaMensal,
    economiaAnual,
    economiaAnualUSD
  };
}

// Atualizar interface do Hero Simulator
function atualizarHeroSimulator() {
  const slider = document.getElementById('heroRevenueSlider');
  const badge = document.getElementById('heroRevenueVal');
  const impostoBrEl = document.getElementById('heroTaxBR');
  const impostoPyEl = document.getElementById('heroTaxPY');
  const economiaEl = document.getElementById('heroSavingsAmount');
  const economiaUsdEl = document.getElementById('heroSavingsUSD');

  if (!slider) return;

  const faturamento = parseFloat(slider.value);
  badge.textContent = formatarMoedaBRL(faturamento);

  const res = calcularTributos(faturamento, 'lucro_presumido');

  if (impostoBrEl) impostoBrEl.textContent = formatarMoedaBRL(res.impostoMensalBrasil) + '/mês';
  if (impostoPyEl) impostoPyEl.textContent = formatarMoedaBRL(res.impostoMensalParaguai) + '/mês';
  if (economiaEl) economiaEl.textContent = formatarMoedaBRL(res.economiaAnual) + '/ano';
  if (economiaUsdEl) economiaUsdEl.textContent = '≈ ' + formatarMoedaUSD(res.economiaAnualUSD) + ' livres de impostos';
}

/**
 * CALCULADORA FAMILIAR DE CUSTO DE VIDA (Assunção vs. Capitais Brasileiras)
 */
const CUSTO_BASE = {
  moradia: {
    br: { sp: 8500, curitiba: 5800, poa: 5200 },
    py: { villa_morra: 4200, santa_teresa: 5500, luque: 2800 }
  },
  educacao_por_filho: {
    br: 3500, // Colégio bilíngue SP/Curitiba
    py: 1900  // Colégio internacional/bilíngue Assunção (ex: San Andrés, SIL)
  },
  saude_familiar: {
    br: 3800, // Bradesco Top / Amil One
    py: 1400  // Asismed VIP / Santa Clara Internacional
  },
  energia_condominio: {
    br: 1800, // Tarifa pesada + bandeira vermelha
    py: 650   // Energia abundante de Itaipu (uma das mais baratas do mundo)
  },
  alimentacao_supermercado: {
    br: 3200,
    py: 2200  // Carnes nobres de exportação a preços muito mais acessíveis
  }
};

function calcularCustoVidaFamiliar(qtdFilhos = 1, padraoMoradia = 'villa_morra', cidadeBrasil = 'sp') {
  const aluguelBR = CUSTO_BASE.moradia.br[cidadeBrasil] || 7500;
  const aluguelPY = CUSTO_BASE.moradia.py[padraoMoradia] || 4200;

  const educacaoBR = qtdFilhos * CUSTO_BASE.educacao_por_filho.br;
  const educacaoPY = qtdFilhos * CUSTO_BASE.educacao_por_filho.py;

  const saudeBR = CUSTO_BASE.saude_familiar.br;
  const saudePY = CUSTO_BASE.saude_familiar.py;

  const energiaBR = CUSTO_BASE.energia_condominio.br;
  const energiaPY = CUSTO_BASE.energia_condominio.py;

  const comidaBR = CUSTO_BASE.alimentacao_supermercado.br;
  const comidaPY = CUSTO_BASE.alimentacao_supermercado.py;

  const totalMensalBR = aluguelBR + educacaoBR + saudeBR + energiaBR + comidaBR;
  const totalMensalPY = aluguelPY + educacaoPY + saudePY + energiaPY + comidaPY;

  const economiaMensal = totalMensalBR - totalMensalPY;
  const percentualEconomia = ((economiaMensal / totalMensalBR) * 100).toFixed(0);

  return {
    totalMensalBR,
    totalMensalPY,
    economiaMensal,
    economiaAnual: economiaMensal * 12,
    percentualEconomia,
    detalhes: {
      aluguel: { br: aluguelBR, py: aluguelPY },
      educacao: { br: educacaoBR, py: educacaoPY },
      saude: { br: saudeBR, py: saudePY },
      energia: { br: energiaBR, py: energiaPY },
      comida: { br: comidaBR, py: comidaPY }
    }
  };
}

// Inicializador de eventos no DOM
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('heroRevenueSlider');
  if (slider) {
    slider.addEventListener('input', atualizarHeroSimulator);
    atualizarHeroSimulator();
  }

  // Cotações dinâmicas na topbar
  const brlRateEl = document.getElementById('rateBRL');
  const usdRateEl = document.getElementById('rateUSD');
  if (brlRateEl) brlRateEl.textContent = `1 BRL = ${COTACAO.BRL_TO_PYG.toLocaleString('pt-BR')} ₲`;
  if (usdRateEl) usdRateEl.textContent = `1 USD = ${COTACAO.USD_TO_PYG.toLocaleString('pt-BR')} ₲`;
});

