/**
 * usePaywallViewModel Hook
 * Business logic for the paywall screen
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSubscriptionStore } from '../store';
import { revenueCatService } from '../services';
import { PAYWALL_FEATURES } from '../constants';
import type { ProductOffering, PaywallFeature } from '../types';
import type { DomainError } from '@/core/errors';
import { createSubscriptionError } from '@/core/errors';

interface UsePaywallViewModelReturn {
  /** Available subscription offerings */
  offerings: ProductOffering[];
  /** Features to display */
  features: PaywallFeature[];
  /** Currently selected package ID */
  selectedPackageId: string | null;
  /** Loading state for fetching offerings */
  isLoadingOfferings: boolean;
  /** Loading state for purchase */
  isPurchasing: boolean;
  /** Loading state for restore */
  isRestoring: boolean;
  /** Error state */
  error: DomainError | null;
  /** Select a package */
  selectPackage: (packageId: string) => void;
  /** Purchase selected package */
  purchase: () => Promise<boolean>;
  /** Restore purchases */
  restorePurchases: () => Promise<boolean>;
  /** Clear error */
  clearError: () => void;
}

export function usePaywallViewModel(): UsePaywallViewModelReturn {
  const [offerings, setOfferings] = useState<ProductOffering[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<DomainError | null>(null);

  // Fetch offerings on mount
  useEffect(() => {
    async function fetchOfferings() {
      try {
        setIsLoadingOfferings(true);
        const fetchedOfferings = await revenueCatService.getOfferings();
        setOfferings(fetchedOfferings);
        
        // Auto-select annual package if available
        const annualPackage = fetchedOfferings.find(o => o.packageType === 'annual');
        if (annualPackage) {
          setSelectedPackageId(annualPackage.identifier);
        } else if (fetchedOfferings.length > 0) {
          setSelectedPackageId(fetchedOfferings[0].identifier);
        }
      } catch (err) {
        console.error('Error fetching offerings:', err);
        setError(createSubscriptionError('Unable to load subscription options', 'UNKNOWN'));
      } finally {
        setIsLoadingOfferings(false);
      }
    }

    fetchOfferings();
  }, []);

  const selectPackage = useCallback((packageId: string) => {
    setSelectedPackageId(packageId);
  }, []);

  const purchase = useCallback(async (): Promise<boolean> => {
    if (!selectedPackageId) {
      Alert.alert('Select a Plan', 'Please select a subscription plan to continue.');
      return false;
    }

    try {
      setError(null);
      setIsPurchasing(true);

      const result = await revenueCatService.purchasePackage(selectedPackageId);

      if (result.success) {
        return true;
      } else {
        if (result.error && !result.error.includes('cancelled')) {
          setError(createSubscriptionError(result.error || 'Purchase failed', 'PURCHASE_FAILED'));
        }
        return false;
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError(createSubscriptionError('Unable to complete purchase', 'PURCHASE_FAILED'));
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPackageId]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsRestoring(true);

      const result = await revenueCatService.restorePurchases();

      if (result.success) {
        Alert.alert('Success', 'Your purchase has been restored.');
        return true;
      } else {
        Alert.alert(
          'No Subscription Found',
          'We couldn\'t find an active subscription for your account.'
        );
        return false;
      }
    } catch (err) {
      console.error('Restore error:', err);
      setError(createSubscriptionError('Unable to restore purchases', 'RESTORE_FAILED'));
      return false;
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    offerings,
    features: PAYWALL_FEATURES,
    selectedPackageId,
    isLoadingOfferings,
    isPurchasing,
    isRestoring,
    error,
    selectPackage,
    purchase,
    restorePurchases,
    clearError,
  };
}
