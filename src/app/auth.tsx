import BackButton from "@/components/BackButton";
import { colours } from "@/constants/style";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setHidden] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple input validation
  const validateForm = () => {
    if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) {
      setError("Please fill out all fields.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const cleanEmail = email.trim();
    const cleanUsername = username.trim()

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
      : await supabase.auth.signUp({ 
        email: cleanEmail, 
        password
      });

    if (error) {
      setError(error.message);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/profile");
      }
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: cleanUsername })
        .eq('id', data.user.id);
    }

    setLoading(false);
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={{ marginBottom: 24 }}>
            <BackButton
              type="Back"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/");
                }
              }}
            />
          </View>
          <Text style={styles.title}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? "Please sign in to proceed."
              : "Please create an account to proceed."}
          </Text>

          <View style={styles.fields}>
            
            {!isLogin &&
            <>
              <Text style={styles.label}>Username</Text> 
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="e.g. John"
                placeholderTextColor={colours.text_placeholder}
              />
            </>
            }
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="e.g. name@example.com"
              placeholderTextColor={colours.text_placeholder}
            />

            <Text style={styles.label}>Password</Text>
            <View>
              <Pressable onPress={() => setHidden((prev) => !prev)} style={styles.showPassword}>
                {
                  passwordHidden ? 
                  <EyeOff size={20} color={colours.text_secondary}/> :
                  <Eye size={20} color={colours.text_secondary}/>
                }
              </Pressable>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={passwordHidden}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={passwordHidden ? "••••••••" : "YourPassword"}
                placeholderTextColor={colours.text_placeholder}
              />
            </View>

          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.toggleRow} onPress={handleToggle}>
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.toggleLink}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary_bg,
  },
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 16,
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
    color: colours.text_secondary,
    borderWidth: 1,
    borderColor: colours.border_1,
  },
  showPassword:{
    position: "absolute",
    right: 18,
    top: 16,
    zIndex: 50,
  },
  button: {
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: colours.border_1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  error: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  toggleRow: {
    alignItems: "center",
    paddingVertical: 16,
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
