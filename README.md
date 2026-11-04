# 🇵🇾 Paraguai Prime - O Portal Oficial de Transição, Negócios e Vida

Plataforma de alta classe desenvolvida sob medida para **famílias de alto padrão** e **empresários/investidores brasileiros** que buscam segurança, qualidade de vida e a vantagem tributária da carga de 10% do Paraguai.

---

## 🎨 Identidade Visual & Design
- **Cores Oficiais do Paraguai com Toque de Luxo:**
  - **Azul Marinho Real (`#0D224A` / `#081225`):** Solidez institucional, discrição e segurança jurídica.
  - **Vermelho Carmim Nobre (`#C51D2A`):** Pontos de conversão, botões de ação e autoridade.
  - **Branco Puro & Off-White (`#FFFFFF` / `#F8FAFC`):** Leveza, espaçamento nobre e máxima legibilidade.
  - **Ouro do Brasão Nacional (`#D4AF37`):** Destaque de prestígio e patrimônio.

---

## 🚀 Como Executar o Projeto Localmente

Você tem duas formas muito simples:

### Opção 1: Via Servidor Node.js Local (Recomendado)
Abra o terminal nesta pasta e execute:
```bash
node server.js
```
Depois abra seu navegador em: **`http://localhost:3000`**

### Opção 2: Direto no Navegador
Basta dar dois cliques no arquivo **`index.html`** para abrir em qualquer navegador (Chrome, Edge, Safari, Firefox).

---

## 📁 Estrutura de Arquivos

- **`index.html`**: A página inicial do portal (Português).
- **`index-es.html`**: A página inicial oficial em Espanhol (Español).
- **`para-empresas.html`**: A página de conversão B2B em Português.
- **`para-empresas-es.html`**: A página B2B oficial em Espanhol para os donos de empresas e prestadores de serviços do Paraguai se credenciarem.
- **`faq.html`**: As 10 perguntas mais feitas no Google com Schema.org.
- **`blog.html`**: O hub editorial e de SEO com a série "Famílias sem Ansiedade".
- **`artigos/`**: Os 10 artigos individuais com fotografias reais e pílulas antiansiedade.
- **`simulador-tributario.html`**: Simulador tributário aprofundado (Brasil vs. Paraguai) com comparativos de Lucro Presumido, Simples Nacional, CLT e o sistema 10-10-10 da Lei 6380/19.
- **`custo-de-vida.html`**: Calculadora de orçamento familiar comparando capitais brasileiras (SP, RJ, Curitiba) com Assunção (moradia nobre, colégios internacionais, saúde e energia).
- **`guia-residencia.html`**: Checklist interativo para a obtenção de residência e cédula paraguaia pela nova Lei de Migrações (Lei 6984/2022).
- **`assets/css/styles.css`**: Design system completo e responsivo nas cores nobres do Paraguai.
- **`assets/js/simulador.js`**: Lógica de cálculo fiscal e custo de vida.
- **`assets/js/main.js`**: Gestão dos modais, leads e redirecionamento de WhatsApp.
- **`server.js`**: Servidor local leve sem necessidade de instalar dependências.

---

## 💰 Como Configurar seu Número de WhatsApp para Receber os Leads

No arquivo `assets/js/main.js`, na linha 8, substitua o número de telefone pelo seu:
```javascript
const WHATSAPP_CONFIG = {
  phone: "5511999999999", // Coloque seu número com DDI e DDD (ex: 55 para Brasil ou 595 para Paraguai)
  ...
};
```
Todos os botões de "Falar com Especialista", simulações de impostos e pedidos de parceria B2B chegarão diretamente no seu WhatsApp com os dados do cliente prontos!

