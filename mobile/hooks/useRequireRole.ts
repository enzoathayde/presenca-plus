import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const useRequireRole = (requiredRole: string) => {
  useEffect(() => {
    const verifyRole = async () => {
      const storedRole = await AsyncStorage.getItem("perfil");
      if (storedRole !== requiredRole) {
        alert("Acesso não autorizado.");
        router.replace("/"); // volta para o dashboard ou tela inicial
      }
    };
    verifyRole();
  }, []);
};
