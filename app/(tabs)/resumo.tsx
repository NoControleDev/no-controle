import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { calculateSummary } from "../helpers/summaryCalculator";
import { getAllExpenses } from "../storage/expenseStorage";

type Summary = {
  total: number;
  mediaDiaria: number;
  registros: number;
  topCategorias: { categoria: string; valor: number }[];
};

export default function Resumo() {
  const [summary, setSummary] = useState<Summary | null>(null);

  // 🔄 Atualiza sempre que a aba Resumo ganha foco
  useFocusEffect(() => {
    async function loadSummary() {
      setSummary(null); // força estado de loading
      const expenses = await getAllExpenses();
      const result = calculateSummary(expenses);
      setSummary(result);
    }

    loadSummary();
  });

  // ⏳ LOADING HUMANIZADO
  if (!summary) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            Calculando seu resumo…
          </Text>
        </View>
      </View>
    );
  }

  // 📭 ESTADO VAZIO (SEM DESPESAS)
  if (summary.registros === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Ainda não há despesas registradas.
          </Text>
          <Text style={styles.subText}>
            Use o 🎤 ou registre manualmente para começar.
          </Text>
        </View>
      </View>
    );
  }

  // ✅ RESUMO NORMAL
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo</Text>

      <Text style={styles.subText}>
        Visão clara dos seus gastos
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total gasto</Text>
        <Text style={styles.value}>
          R$ {summary.total.toFixed(2).replace(".", ",")}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Média diária</Text>
        <Text style={styles.value}>
          R$ {summary.mediaDiaria.toFixed(2).replace(".", ",")}
        </Text>
        <Text style={styles.subText}>
          Baseada nos dias em que você gastou
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Registros</Text>
        <Text style={styles.value}>{summary.registros}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Onde seu dinheiro mais foi neste período
        </Text>
        {summary.topCategorias.map((item) => (
          <Text key={item.categoria} style={styles.categoryText}>
            {item.categoria}: R${" "}
            {item.valor.toFixed(2).replace(".", ",")}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* 🎨 ESTILOS COMPLETOS */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    color: "#666",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryText: {
    marginTop: 6,
    fontWeight: "600",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#0A8F55",
    fontWeight: "600",
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});