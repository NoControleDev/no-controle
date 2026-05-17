import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAllExpenses } from "../storage/expenseStorage";

/* =============================== */

type Period =
  | "today"
  | "week"
  | "month"
  | "year"
  | "lastYear"
  | "all"
  | "custom";

type Expense = {
  id: string;
  valor: number;
  categoria: string;
  data: string;
};

/* =============================== */

export default function Resumo() {
  const [period, setPeriod] = useState<Period>("year");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);

  const now = new Date();

  useEffect(() => {
    async function load() {
      const data = await getAllExpenses();
      setExpenses(data || []);
    }
    load();
  }, []);

  const mostrarComparacao =
    period !== "custom" && period !== "all";

  /* ===============================
     FILTRO ATUAL
  =============================== */

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.data);

      if (period === "today") {
        return d.toDateString() === now.toDateString();
      }

      if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return d >= start && d <= end;
      }

      if (period === "month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return d.getFullYear() === now.getFullYear();
      }

      if (period === "lastYear") {
        return d.getFullYear() === now.getFullYear() - 1;
      }

      if (period === "all") return true;
      if (period === "custom") return true;

      return false;
    });
  }, [expenses, period]);

  /* ===============================
     FILTRO ANTERIOR
  =============================== */

  const previousFiltered = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.data);

      if (period === "today") {
        const ontem = new Date(now);
        ontem.setDate(now.getDate() - 1);
        return d.toDateString() === ontem.toDateString();
      }

      if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() - 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return d >= start && d <= end;
      }

      if (period === "month") {
        return (
          d.getMonth() === now.getMonth() - 1 &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return d.getFullYear() === now.getFullYear() - 1;
      }

      return false;
    });
  }, [expenses, period]);

  /* ===============================
     CÁLCULOS
  =============================== */

  const total = filtered.reduce((s, e) => s + e.valor, 0);
  const previousTotal = previousFiltered.reduce(
    (s, e) => s + e.valor,
    0
  );

  const diffTotal = total - previousTotal;

  const dias = new Set(filtered.map((e) => e.data)).size;
  const media = dias > 0 ? total / dias : 0;

  const previousDias = new Set(
    previousFiltered.map((e) => e.data)
  ).size;

  const previousMedia =
    previousDias > 0 ? previousTotal / previousDias : 0;

  /* ===============================
     TOP CATEGORIAS E GASTOS
  =============================== */

  const porCategoria: Record<string, number> = {};
  filtered.forEach((e) => {
    porCategoria[e.categoria] =
      (porCategoria[e.categoria] || 0) + e.valor;
  });

  const topCategorias = Object.entries(porCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topGastos = [...filtered]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 3);

  /* =============================== */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NO CONTROLE</Text>

      {/* 🔥 SELETOR */}
      <TouchableOpacity
        style={styles.periodBox}
        onPress={() => setMenuAberto(!menuAberto)}
      >
        <Text style={styles.periodText}>
          📅 {labelPeriod(period)}
        </Text>
      </TouchableOpacity>

      {menuAberto && (
        <View style={styles.menu}>
          {[
            ["Hoje", "today"],
            ["Esta semana", "week"],
            ["Este mês", "month"],
            ["Este ano", "year"],
            ["Ano passado", "lastYear"],
            ["Desde o início", "all"],
            ["Personalizado", "custom"],
          ].map(([label, value]) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                setPeriod(value as Period);
                setMenuAberto(false);
              }}
            >
              <Text style={styles.menuItem}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.row}>
        <Card title="💰 Total gasto" value={`R$ ${total.toFixed(2)}`}>
          {mostrarComparacao && (
  <Text style={styles.subText}>
    {previousTotal === 0
      ? "Sem dados do período anterior para comparação."
      : diffTotal === 0
      ? "Gasto igual ao período anterior."
      : diffTotal > 0
      ? `Você gastou R$ ${diffTotal.toFixed(2)} a mais que o período anterior.`
      : `Você gastou R$ ${Math.abs(diffTotal).toFixed(2)} a menos que o período anterior.`}
  </Text>
)}

        </Card>

        <Card title="📊 Média diária" value={`R$ ${media.toFixed(2)}`}>
          {mostrarComparacao && previousMedia > 0 && (
            <Text style={styles.subText}>
              No período anterior, sua média foi R$ {previousMedia.toFixed(2)}.
            </Text>
          )}
        </Card>
      </View>

      <View style={styles.row}>
        <Card title="🔥 Top 3 maiores gastos">
          {topGastos.map((e, i) => (
            <Text key={e.id}>
              {i + 1}. R$ {e.valor.toFixed(2)} — {e.categoria}
            </Text>
          ))}
        </Card>

        <Card title="🏷️ Top 3 categorias">
          {topCategorias.map(([cat, val]) => (
            <Text key={cat}>
              • {cat} — R$ {val.toFixed(2)}
            </Text>
          ))}
        </Card>
      </View>
    </View>
  );
}

/* =============================== */

function Card({ title, value, children }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {value && <Text style={styles.cardValue}>{value}</Text>}
      {children}
    </View>
  );
}

function labelPeriod(p: Period) {
  switch (p) {
    case "today":
      return "Hoje";
    case "week":
      return "Esta semana";
    case "month":
      return "Este mês";
    case "year":
      return "Este ano";
    case "lastYear":
      return "Ano passado";
    case "all":
      return "Desde o início";
    case "custom":
      return "Personalizado";
  }
}

/* =============================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F8FA" },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A8F55",
  },

  periodBox: { alignItems: "center", marginVertical: 10 },

  periodText: { color: "#555" },

  menu: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  menuItem: { paddingVertical: 6 },

  row: { flexDirection: "row", gap: 10 },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginBottom: 12,
  },

  cardTitle: { fontSize: 14, color: "#666" },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },

  subText: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },
});