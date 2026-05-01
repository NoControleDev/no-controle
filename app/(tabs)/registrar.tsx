import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Registrar() {
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");

  function salvar() {
    if (!valor || !categoria) {
      alert("Preencha valor e categoria");
      return;
    }

    console.log({
      valor,
      categoria,
      data: data || "hoje",
    });

    alert("Despesa registrada (mock)");

    setValor("");
    setCategoria("");
    setData("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar despesa</Text>

      {/* VALOR */}
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 45,90"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      {/* CATEGORIA */}
      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Supermercado"
        value={categoria}
        onChangeText={setCategoria}
      />

      {/* DATA */}
      <Text style={styles.label}>Data (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA ou deixar vazio"
        value={data}
        onChangeText={setData}
      />

      {/* BOTÃO */}
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar despesa</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===== ESTILOS ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0A8F55",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
