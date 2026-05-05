/**
 * Faz o match semântico de categorias
 * com prioridade explícita e gírias reais (pt-BR)
 */
export function matchCategory(text: string): string {
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  /* 🚗 TRANSPORTE / COMBUSTÍVEL (PRIORIDADE ALTA) */
  if (
    t.includes("gasolina") ||
    t.includes("etanol") ||
    t.includes("alcool") ||
    t.includes("diesel") ||
    t.includes("combustivel") ||
    t.includes("posto") ||
    t.includes("abasteci") ||
    t.includes("abastecer") ||
    t.includes("abastecimento") ||
    t.includes("gasosa") ||        // 🇧🇷 gíria SP
    t.includes("gas") ||            // “coloquei gas”
    t.includes("combus")             // “combus”
  ) {
    return "Transporte";
  }

  /* 🛒 ALIMENTAÇÃO */
  if (
    t.includes("mercado") ||
    t.includes("supermercado") ||
    t.includes("padaria") ||
    t.includes("acougue") ||
    t.includes("restaurante") ||
    t.includes("almoco") ||
    t.includes("jantar") ||
    t.includes("lanche") ||
    t.includes("comida") ||
    t.includes("rango") ||          // 🇧🇷 gíria
    t.includes("quentinha") ||      // 🇧🇷 gíria
    t.includes("marmita") ||         // 🇧🇷 gíria
    t.includes("ifood") ||
    t.includes("delivery")
  ) {
    return "Alimentação";
  }

  /* 🛠️ SERVIÇOS / MANUTENÇÃO */
  if (
    t.includes("manutencao") ||
    t.includes("conserto") ||
    t.includes("reparo") ||
    t.includes("servico") ||
    t.includes("oficina") ||
    t.includes("mecanico") ||
    t.includes("arrumar")
  ) {
    return "Serviços";
  }

  /* 🏠 MORADIA */
  if (
    t.includes("aluguel") ||
    t.includes("condominio") ||
    t.includes("energia") ||
    t.includes("luz") ||
    t.includes("agua") ||
    t.includes("internet")
  ) {
    return "Moradia";
  }

  /* 💊 SAÚDE */
  if (
    t.includes("farmacia") ||
    t.includes("remedio") ||
    t.includes("medicamento") ||
    t.includes("consulta") ||
    t.includes("exame")
  ) {
    return "Saúde";
  }

  /* 💳 CARTÃO DE CRÉDITO */
  if (
    t.includes("cartao") ||
    t.includes("credito") ||
    t.includes("fatura")
  ) {
    return "Cartão de crédito";
  }

  /* 🔚 FALLBACK SEGURO */
  return "Outros";
}
