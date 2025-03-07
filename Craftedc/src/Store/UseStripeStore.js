import { create } from "zustand";
import { persist } from "zustand/middleware";

const UseStripeStore = create(
  persist(
    (set, get) => ({
      clientSecret: null,
      setClientSecretForSuccess: (secret) => {
        console.group("🔐 Stripe Client Secret Update");
        console.log("New Secret:", secret);
        console.log("Previous Secret:", get().clientSecret);
        console.trace("Stack Trace for Secret Update");
        console.groupEnd();

        set({ clientSecret: secret });
      },
      clearClientSecretForSuccess: () => {
        console.group("🧹 Clearing Stripe Client Secret");
        console.log("Current Secret:", get().clientSecret);
        console.trace("Stack Trace for Secret Clearing");
        console.groupEnd();

        set({ clientSecret: null });
      },
      // Debug method to log current state
      debugClientSecret: () => {
        console.group("🕵️ Client Secret Debug");
        console.log("Current Client Secret:", get().clientSecret);
        console.log("Is Client Secret Set:", !!get().clientSecret);
        console.groupEnd();
        return get().clientSecret;
      },
    }),
    {
      name: "stripe-storage", // unique name
      getStorage: () => localStorage, // use localStorage for persistence
    },
  ),
);

export default UseStripeStore;
