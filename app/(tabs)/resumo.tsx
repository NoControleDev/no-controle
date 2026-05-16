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

  const mostrarComparacao = period !== "custom";

  /* ✅ FILTRO */
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

  /* ✅ CÁLCULOS */

  const total = filtered.reduce((sum, e) => sum + e.valor, 0);

  const dias = new Set(filtered.map((e) => e.data)).size;

  const media = dias > 0 ? total / dias : 0;

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

      {/* 🔥 MENU */}
      {menuAberto && (
        <View style={styles.menu}>
          {[
            { label: "Hoje", value: "today" },
            { label: "Esta semana", value: "week" },
            { label: "Este mês", value: "month" },
            { label: "Este ano", value: "year" },
            { label: "Ano passado", value: "lastYear" },
            { label: "Desde o início", value: "all" },
            { label: "Personalizado", value: "custom" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                setPeriod(item.value as any);
                setMenuAberto(false);
              }}
              style={styles.menuItem}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.row}>
        <Card title="💰 Total gasto" value={`R$ ${total.toFixed(2)}`}>
          {mostrarComparacao && (
            <Text style={styles.subText}>
              Comparação com período anterior
            </Text>
          )}
        </Card>

        <Card title="📊 Média diária" value={`R$ ${media.toFixed(2)}`}>
          {mostrarComparacao && (
            <Text style={styles.subText}>
              Média baseada nos dias com gasto
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

function Card({
  title,
  value,
  children,
}: any) {
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F8FA",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A8F55",
  },

  periodBox: {
    alignItems: "center",
    marginVertical: 10,
  },

  periodText: {
    color: "#555",
  },

  menu: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  menuItem: {
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 14,
    color: "#666",
  },

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