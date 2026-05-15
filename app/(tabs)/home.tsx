import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAllExpenses } from "../storage/expenseStorage";

export default function Home() {
  const router = useRouter();

  const [totalHoje, setTotalHoje] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  const [registrosHoje, setRegistrosHoje] = useState(0);
  const [comparacaoTexto, setComparacaoTexto] = useState("");

  /* ✅ Função segura de data */
  function parseDateSafe(dateStr: string) {
    const [ano, mes, dia] = dateStr.split("-");
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  /* ✅ Formatação BR */
  function formatMoney(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        const data = await getAllExpenses();

        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        let totalDiaTemp = 0;
        let totalMesTemp = 0;
        let registrosTemp = 0;

        let totalOntem = 0;
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);

        data.forEach((item) => {
          const d = parseDateSafe(item.data);

          // 🔥 TOTAL HOJE
          if (
            d.getDate() === hoje.getDate() &&
            d.getMonth() === mesAtual &&
            d.getFullYear() === anoAtual
          ) {
            totalDiaTemp += Number(item.valor);
            registrosTemp++;
          }

          // 📅 TOTAL MÊS
          if (
            d.getMonth() === mesAtual &&
            d.getFullYear() === anoAtual
          ) {
            totalMesTemp += Number(item.valor);
          }

          // 📊 TOTAL ONTEM
          if (
            d.getDate() === ontem.getDate() &&
            d.getMonth() === ontem.getMonth() &&
            d.getFullYear() === ontem.getFullYear()
          ) {
            totalOntem += Number(item.valor);
          }
        });

        // ✅ TEXTO DE COMPARAÇÃO
        let texto = "";

        if (totalOntem === 0 ) {
          texto = "";
        } else if (totalDiaTemp > totalOntem) {
          texto = `Você gastou ${formatMoney(
            totalDiaTemp - totalOntem
          )} a mais que ontem ⚠️`;
        } else if (totalDiaTemp < totalOntem) {
          texto = `Você gastou ${formatMoney(
            totalOntem - totalDiaTemp
          )} a menos que ontem ✅`;
        } else {
          texto = "Seus gastos estão iguais aos de ontem 📊";
        }

        setTotalHoje(totalDiaTemp);
        setTotalMes(totalMesTemp);
        setRegistrosHoje(registrosTemp);
        setComparacaoTexto(texto);
      }

      carregarDados();
    }, [])
  );

  function iniciarRegistroPorVoz() {
    const voiceId = Date.now().toString();
    router.push(`/(tabs)/registrar?voiceId=${voiceId}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Controle</Text>
      <Text style={styles.subtitle}>Hoje</Text>

      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          {registrosHoje === 0
            ? "Você ainda não registrou nenhum gasto hoje."
            : "Seus gastos estão registrados ✅"}
        </Text>
      </View>

      {/* 🔥 NOVO BLOCO DE COMPARAÇÃO */}
      {comparacaoTexto !== "" && (
        <View style={styles.compareBox}>
          <Text style={styles.compareText}>{comparacaoTexto}</Text>
        </View>
      )}

      <View style={styles.metrics}>
        <View style={styles.metricCardHighlight}>
  <Text style={styles.metricLabel}>Total do dia</Text>

  <Text style={styles.metricValue}>
    {formatMoney(totalHoje)}
  </Text>

  {/* 🔥 FRASE DENTRO DO CARD */}
  {comparacaoTexto !== "" && (
    <Text style={styles.compareInline}>
      {comparacaoTexto}
    </Text>
  )}
</View>





        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total do mês</Text>
          <Text style={styles.metricValue}>
            {formatMoney(totalMes)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Registros hoje</Text>
          <Text style={styles.metricValue}>
            {registrosHoje}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.voiceButton}
        onPress={iniciarRegistroPorVoz}
      >
        <Text style={styles.voiceButtonText}>🎤 Falar despesa</Text>
      </TouchableOpacity>
    </View>



   
   



  );
}

/* 🎨 ESTILOS */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F8FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A8F55",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },

  insightBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#eee",
    elevation: 3,
  },

  insightText: {
    fontSize: 15,
    color: "#333",
  },

  compareBox: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: "#eee",
    elevation: 2,
  },

  compareText: {
    fontSize: 14,
    color: "#444",
  },

  metrics: {
    marginBottom: 24,
  },

  metricCardHighlight: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#0A8F55",
    elevation: 3,
  },

  metricCard: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#eee",
    elevation: 3,
  },

  metricLabel: {
    fontSize: 13,
    color: "#888",
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
    color: "#0A8F55",
  },

compareInline: {
  marginTop: 6,
  fontSize: 13,
  color: "#555",
},


  voiceButton: {
    backgroundColor: "#0A8F55",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },

  voiceButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});