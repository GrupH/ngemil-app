import { colours } from "@/constants/style";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? "Please sign in to proceed."
            : "Please create an account to proceed."}
        </Text>

        <View style={styles.fields}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={colours.text_secondary}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colours.text_secondary}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "..." : isLogin ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.toggleRow}
        onPress={() => {
          setIsLogin(!isLogin);
        }}
      >
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.toggleLink}>
            {isLogin ? "Sign Up" : "Sign In"}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary_bg,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colours.accent_1,
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colours.text_secondary,
    marginBottom: 48,
  },
  fields: {
    gap: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: colours.text_secondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colours.text_secondary,
    borderWidth: 1,
    borderColor: colours.border_1,
  },
  button: {
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: colours.border_1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  error: {
    color: "#e74c3c",
    fontSize: 13,
    marginBottom: 12,
  },
  toggleRow: {
    alignItems: "center",
    paddingBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    color: colours.text_secondary,
    fontWeight: "600",
  },
  toggleLink: {
    color: colours.accent_1,
    fontWeight: "700",
  },
});
