import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { matchCategory } from "../helpers/categoryMatcher";

export default function Confirmacao() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const textoFalado = String(params.texto || "");
  const valor = params.valor ? String(params.valor) : "0,00";
  const categoria = matchCategory(textoFalado);
  const data = "Hoje";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar despesa</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Valor</Text>
        <Text style={styles.value}>R$ {valor}</Text>

        <Text style={styles.label}>Categoria</Text>
        <Text style={styles.value}>{categoria}</Text>

        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{data}</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          alert("Despesa salva (mock)");
          router.replace("/(tabs)/home");
        }}
      >
        <Text style={styles.confirmText}>✅ Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.adjustButton}
        onPress={() => router.back()}
      >
        <Text style={styles.adjustText}>✏️ Ajustar</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===== ESTILOS ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  label: {
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#0A8F55",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  adjustButton: {
    alignItems: "center",
  },
  adjustText: {
    color: "#0A8F55",
    fontSize: 16,
    fontWeight: "600",
  },
});