/**
 * Create Medical Fact Screen - Doctor flow
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { FactType, ConfidenceLevel } from '@/types/medical';

export default function CreateFactScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [factType, setFactType] = useState<FactType>(FactType.DIAGNOSIS);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>(
    ConfidenceLevel.HIGH
  );

  const factTypes = [
    { value: FactType.DIAGNOSIS, label: 'Diagnosis' },
    { value: FactType.PRESCRIPTION, label: 'Prescription' },
    { value: FactType.PROCEDURE, label: 'Procedure' },
    { value: FactType.VITAL_SIGN, label: 'Vital Sign' },
  ];

  const confidenceLevels = [
    { value: ConfidenceLevel.HIGH, label: 'High' },
    { value: ConfidenceLevel.MEDIUM, label: 'Medium' },
    { value: ConfidenceLevel.LOW, label: 'Low' },
  ];

  const handleSubmit = async () => {
    // In production, create fact via API
    console.log('Create fact:', { factType, title, description, confidence });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Medical Fact</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Fact Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Fact Type</Text>
          <View style={styles.options}>
            {factTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  factType === type.value && styles.optionActive,
                ]}
                onPress={() => setFactType(type.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    factType === type.value && styles.optionTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter fact title"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter detailed description"
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Confidence Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Confidence Level</Text>
          <View style={styles.options}>
            {confidenceLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.option,
                  confidence === level.value && styles.optionActive,
                ]}
                onPress={() => setConfidence(level.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    confidence === level.value && styles.optionTextActive,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!title.trim()}
        >
          <Text style={styles.submitButtonText}>Anchor Fact</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
  },
  optionActive: {
    borderColor: Colors.accent.primary,
    backgroundColor: `${Colors.accent.primary}20`,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  optionTextActive: {
    color: Colors.accent.primary,
  },
  input: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: Colors.accent.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  submitButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});

