/**
 * useUnitPreference
 * Persistent Zustand store for the user's preferred measurement unit system.
 * Defaults to 'metric'. Persisted to AsyncStorage so the choice survives app restarts.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnitSystem } from '../utils/unitConversions';

interface UnitPreferenceState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
}

export const useUnitPreference = create<UnitPreferenceState>()(
  persist(
    (set) => ({
      unitSystem: 'metric',
      setUnitSystem: (unitSystem) => set({ unitSystem }),
    }),
    {
      name: 'unit-preference-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
