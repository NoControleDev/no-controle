import { matchCategory } from "./categoryMatcher";

const numberWords: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  cem: 100,
  cento: 100,
};

const months: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseValue(text: string): number | null {
  const digit = text.match(/\d+/);
  if (digit) return Number(digit[0]);

  let total = 0;
  Object.keys(numberWords).forEach((k) => {
    if (text.includes(k)) total += numberWords[k];
  });

  return total > 0 ? total : null;
}

function parseDateFromSpeech(text: string): Date {
  const now = new Date();
  let day: number | null = null;
  let month: number | null = null;
  let year: number = now.getFullYear();

  const digitDay = text.match(/dia (\d{1,2})/);
  if (digitDay) day = Number(digitDay[1]);

  Object.keys(numberWords).forEach((k) => {
    if (text.includes(`dia ${k}`)) day = numberWords[k];
  });

  Object.keys(months).forEach((m) => {
    if (text.includes(m)) month = months[m];
  });

  return new Date(
    year,
    month !== null ? month : now.getMonth(),
    day !== null ? day : now.getDate()
  );
}

export function parseSpeech(textoFalado: string) {
  const text = normalize(textoFalado);

  return {
    valor: parseValue(text),
    categoria: matchCategory(text),
    data: parseDateFromSpeech(text),
    raw: textoFalado,
  };
}