/**
 * Splash Screen Preview Component
 * Development tool to compare both splash screen versions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SplashScreen } from './SplashScreen';
import { EnhancedSplashScreen } from './EnhancedSplashScreen';
import { colors } from '@core/theme/colors';
import { typography } from '@core/theme/typography';

export const SplashScreenPreview: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'standard' | 'enhanced' | 'compare'>('standard');
  const [key, setKey] = useState(0);

  const resetAnimation = () => {
    setKey(prev => prev + 1);
  };

  const handleFinish = () => {
    console.log('Splash animation finished');
    // In preview mode, we just reset to replay
    setTimeout(() => resetAnimation(), 500);
  };

  return (
    <View style={styles.container}>
      {/* Control Panel */}
      <View style={styles.controls}>
        <Text style={styles.title}>Splash Screen Preview</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, activeScreen === 'standard' && styles.buttonActive]}
            onPress={() => {
              setActiveScreen('standard');
              resetAnimation();
            }}
          >
            <Text style={[styles.buttonText, activeScreen === 'standard' && styles.buttonTextActive]}>
              Standard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, activeScreen === 'enhanced' && styles.buttonActive]}
            onPress={() => {
              setActiveScreen('enhanced');
              resetAnimation();
            }}
          >
            <Text style={[styles.buttonText, activeScreen === 'enhanced' && styles.buttonTextActive]}>
              Enhanced
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.replayButton} onPress={resetAnimation}>
          <Text style={styles.replayText}>🔄 Replay Animation</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            {activeScreen === 'standard' 
              ? '⏱️ Duration: 3s • 🎨 Clean & Professional'
              : '⏱️ Duration: 3.5s • ✨ Premium & Sophisticated'}
          </Text>
        </View>
      </View>

      {/* Preview Area */}
      <View style={styles.previewContainer}>
        {activeScreen === 'standard' && (
          <SplashScreen key={`standard-${key}`} onFinish={handleFinish} />
        )}
        {activeScreen === 'enhanced' && (
          <EnhancedSplashScreen key={`enhanced-${key}`} onFinish={handleFinish} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  controls: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.button,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  buttonTextActive: {
    color: '#ffffff',
  },
  replayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    marginBottom: 12,
  },
  replayText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  info: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.infoDim,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewContainer: {
    flex: 1,
  },
});
