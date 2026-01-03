/**
 * Create Medical Fact Screen - Complete doctor workflow for creating medical records
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTruthStore } from '@/store/truthStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { mockPatients } from '@/services/mockData';

// Define fact types
const FactTypes = {
  DIAGNOSIS: 'diagnosis',
  LAB_RESULT: 'lab_result',
  PRESCRIPTION: 'prescription',
  PROCEDURE: 'procedure',
  VACCINATION: 'vaccination',
  VITAL_SIGNS: 'vital_signs',
  ALLERGY: 'allergy',
  IMAGING: 'imaging',
};

const ConfidenceLevels = {
  HIGH: 0.95,
  MEDIUM: 0.80,
  LOW: 0.60,
};

export default function CreateFactScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addFact } = useTruthStore();
  
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [factType, setFactType] = useState(FactTypes.DIAGNOSIS);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [confidence, setConfidence] = useState<number>(ConfidenceLevels.HIGH);
  const [notes, setNotes] = useState('');
  
  // Dynamic values based on fact type
  const [values, setValues] = useState<Record<string, string>>({});

  const factTypes = [
    { value: FactTypes.DIAGNOSIS, label: 'Diagnosis', icon: '🩺' },
    { value: FactTypes.LAB_RESULT, label: 'Lab Result', icon: '🧪' },
    { value: FactTypes.PRESCRIPTION, label: 'Prescription', icon: '💊' },
    { value: FactTypes.PROCEDURE, label: 'Procedure', icon: '🏥' },
    { value: FactTypes.VACCINATION, label: 'Vaccination', icon: '💉' },
    { value: FactTypes.VITAL_SIGNS, label: 'Vital Signs', icon: '❤️' },
    { value: FactTypes.ALLERGY, label: 'Allergy', icon: '⚠️' },
    { value: FactTypes.IMAGING, label: 'Imaging', icon: '📷' },
  ];

  const confidenceLevels = [
    { value: ConfidenceLevels.HIGH, label: 'High (95%)', color: '#4ECDC4' },
    { value: ConfidenceLevels.MEDIUM, label: 'Medium (80%)', color: '#FFE66D' },
    { value: ConfidenceLevels.LOW, label: 'Low (60%)', color: '#FF6B6B' },
  ];

  // Get value fields based on fact type
  const getValueFields = () => {
    switch (factType) {
      case FactTypes.DIAGNOSIS:
        return [
          { key: 'icdCode', label: 'ICD-10 Code', placeholder: 'e.g., E11.9' },
          { key: 'severity', label: 'Severity', placeholder: 'Mild/Moderate/Severe' },
        ];
      case FactTypes.LAB_RESULT:
        return [
          { key: 'testName', label: 'Test Name', placeholder: 'e.g., Complete Blood Count' },
          { key: 'value', label: 'Value', placeholder: 'e.g., 5.2' },
          { key: 'unit', label: 'Unit', placeholder: 'e.g., mmol/L' },
          { key: 'referenceRange', label: 'Reference Range', placeholder: 'e.g., 4.0-6.0' },
        ];
      case FactTypes.PRESCRIPTION:
        return [
          { key: 'medication', label: 'Medication', placeholder: 'Drug name' },
          { key: 'dosage', label: 'Dosage', placeholder: 'e.g., 500mg' },
          { key: 'frequency', label: 'Frequency', placeholder: 'e.g., Twice daily' },
          { key: 'duration', label: 'Duration', placeholder: 'e.g., 7 days' },
        ];
      case FactTypes.VITAL_SIGNS:
        return [
          { key: 'bloodPressure', label: 'Blood Pressure', placeholder: 'e.g., 120/80 mmHg' },
          { key: 'heartRate', label: 'Heart Rate', placeholder: 'e.g., 72 bpm' },
          { key: 'temperature', label: 'Temperature', placeholder: 'e.g., 98.6°F' },
          { key: 'weight', label: 'Weight', placeholder: 'e.g., 70 kg' },
        ];
      case FactTypes.VACCINATION:
        return [
          { key: 'vaccineName', label: 'Vaccine Name', placeholder: 'e.g., Influenza' },
          { key: 'lotNumber', label: 'Lot Number', placeholder: 'e.g., ABC123' },
          { key: 'manufacturer', label: 'Manufacturer', placeholder: 'e.g., Pfizer' },
          { key: 'site', label: 'Injection Site', placeholder: 'e.g., Left Arm' },
        ];
      case FactTypes.ALLERGY:
        return [
          { key: 'allergen', label: 'Allergen', placeholder: 'e.g., Penicillin' },
          { key: 'reaction', label: 'Reaction Type', placeholder: 'e.g., Anaphylaxis' },
          { key: 'severity', label: 'Severity', placeholder: 'Mild/Moderate/Severe' },
        ];
      case FactTypes.IMAGING:
        return [
          { key: 'modality', label: 'Modality', placeholder: 'e.g., X-Ray, MRI, CT' },
          { key: 'bodyPart', label: 'Body Part', placeholder: 'e.g., Chest' },
          { key: 'findings', label: 'Findings', placeholder: 'Summary of findings' },
        ];
      default:
        return [];
    }
  };

  // Reset values when fact type changes
  useEffect(() => {
    setValues({});
  }, [factType]);

  const handleSubmit = async () => {
    if (!selectedPatient) {
      Alert.alert('Error', 'Please select a patient');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain anchoring delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create the fact
    const newFact: any = {
      id: `fact_${Date.now()}`,
      patientId: selectedPatient.id,
      factType,
      title,
      description,
      data: values,
      values,
      confidenceLevel: confidence,
      confidenceScore: confidence,
      issuerName: user?.name || 'Dr. Unknown',
      issuerRole: 'doctor',
      issuerId: user?.id || 'doctor_1',
      createdBy: user?.id || 'doctor_1',
      verifiedBy: user?.id,
      verifiedAt: new Date(),
      verificationLevel: 'provider_verified',
      verificationStatus: 'verified',
      timestamp: new Date(),
      recordedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 12000000,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 12000000,
        timestamp: new Date(),
        network: 'HealthOS Private Chain',
      },
      metadata: {
        notes: notes || undefined,
      },
      version: 1,
    };

    // Add to store
    addFact(newFact);
    
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const valueFields = getValueFields();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Create Medical Fact</Text>
          <Text style={styles.headerSubtitle}>Create & anchor to blockchain</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Patient Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Patient</Text>
            <TouchableOpacity 
              style={styles.patientSelector}
              onPress={() => setShowPatientModal(true)}
            >
              {selectedPatient ? (
                <View style={styles.selectedPatient}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientInitial}>
                      {selectedPatient.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{selectedPatient.name}</Text>
                    <Text style={styles.patientId}>ID: {selectedPatient.id}</Text>
                  </View>
                  <Text style={styles.changeText}>Change</Text>
                </View>
              ) : (
                <View style={styles.selectPatientPrompt}>
                  <Text style={styles.selectPatientText}>Select Patient</Text>
                  <Text style={styles.selectPatientArrow}>→</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Fact Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Fact Type</Text>
            <View style={styles.factTypeGrid}>
              {factTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.factTypeOption,
                    factType === type.value && styles.factTypeOptionActive,
                  ]}
                  onPress={() => setFactType(type.value)}
                >
                  <Text style={styles.factTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.factTypeLabel,
                      factType === type.value && styles.factTypeLabelActive,
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
            <Text style={styles.sectionTitle}>📝 Title *</Text>
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
            <Text style={styles.sectionTitle}>📄 Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter detailed description"
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Dynamic Value Fields */}
          {valueFields.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Values</Text>
              <View style={styles.valuesContainer}>
                {valueFields.map((field) => (
                  <View key={field.key} style={styles.valueField}>
                    <Text style={styles.valueLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.valueInput}
                      value={values[field.key] || ''}
                      onChangeText={(text) => setValues(prev => ({ ...prev, [field.key]: text }))}
                      placeholder={field.placeholder}
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Confidence Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Confidence Level</Text>
            <View style={styles.confidenceOptions}>
              {confidenceLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.confidenceOption,
                    confidence === level.value && { 
                      borderColor: level.color,
                      backgroundColor: `${level.color}20`,
                    },
                  ]}
                  onPress={() => setConfidence(level.value)}
                >
                  <View style={[styles.confidenceDot, { backgroundColor: level.color }]} />
                  <Text
                    style={[
                      styles.confidenceLabel,
                      confidence === level.value && { color: level.color },
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clinical Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Clinical Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes for the record"
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Blockchain Info */}
          <View style={styles.blockchainInfo}>
            <Text style={styles.blockchainIcon}>⛓️</Text>
            <Text style={styles.blockchainText}>
              This fact will be cryptographically signed and anchored to the HealthOS blockchain, 
              ensuring immutability and verifiability.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!title.trim() || !selectedPatient || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !selectedPatient || isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>⛓️ Anchoring to Blockchain...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Create & Anchor Fact</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Patient Selection Modal */}
      <Modal visible={showPatientModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Patient</Text>
              <TouchableOpacity onPress={() => setShowPatientModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.patientList}>
              {mockPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.patientItem}
                  onPress={() => {
                    setSelectedPatient(patient);
                    setShowPatientModal(false);
                  }}
                >
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientInitial}>{patient.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      {patient.email}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Fact Created Successfully!</Text>
            <Text style={styles.successText}>
              The medical fact has been created and anchored to the blockchain. 
              It is now immutable and verifiable.
            </Text>
            <View style={styles.hashPreview}>
              <Text style={styles.hashLabel}>Transaction Hash</Text>
              <Text style={styles.hashValue}>0x8a7f...c3e2</Text>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  patientSelector: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  selectPatientPrompt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  selectPatientText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
  },
  selectPatientArrow: {
    fontSize: Typography.fontSize.lg,
    color: Colors.accent.primary,
  },
  selectedPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  patientInitial: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  patientId: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  patientDetails: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  changeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
  },
  factTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  factTypeOption: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  factTypeOptionActive: {
    borderColor: Colors.accent.primary,
    backgroundColor: `${Colors.accent.primary}20`,
  },
  factTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  factTypeLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  factTypeLabelActive: {
    color: Colors.accent.primary,
    fontWeight: Typography.fontWeight.medium,
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
    minHeight: 100,
  },
  valuesContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  valueField: {
    marginBottom: Spacing.sm,
  },
  valueLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  valueInput: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  confidenceOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  confidenceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  confidenceLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  blockchainInfo: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE720',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  blockchainIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  blockchainText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.accent.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  patientList: {
    padding: Spacing.md,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  successModal: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  successText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  hashPreview: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  hashLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  hashValue: {
    fontSize: Typography.fontSize.base,
    color: '#6C5CE7',
    fontFamily: 'monospace',
  },
  doneButton: {
    backgroundColor: Colors.accent.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  doneButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
});

