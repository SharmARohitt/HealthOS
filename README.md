# HealthOS - The Medical Truth Layer

Enterprise-grade healthcare protocol application built with Expo and TypeScript. A world-class medical truth ledger system designed for trust, clarity, and intelligence.

## Overview

HealthOS is **not** an EHR or hospital app. It is a **Medical Truth Ledger** - a consent-as-code system that provides a verifiable medical timeline and acts as a neutral protocol layer for healthcare data.

## Features

- **Medical Fact Objects (MFO)**: Immutable, versioned medical assertions with cryptographic integrity
- **Consent as Code**: Time-bound, purpose-bound, revocable consent with audit trails
- **Medical Timeline**: Git-like immutable sequence of medical facts
- **Role-Based Access**: Multi-role support (Patient, Doctor, Lab, Insurer, Auditor)
- **Blockchain Anchoring**: Cryptographic verification and immutability
- **Trust-First UI**: Dark-first, minimal, authoritative design inspired by high-trust systems

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
healthos/
├── app/              # Expo Router screens (role-based)
├── components/       # Reusable UI components
├── constants/        # Theme and design system
├── services/         # API, blockchain, identity, consent services
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Architecture

This application follows **clean architecture principles** with strict separation of concerns:

- **Types**: Core domain models and TypeScript interfaces
- **Store**: Zustand-based state management (auth, user, truth)
- **Services**: API, blockchain, identity, and consent service layers
- **Components**: Reusable UI components organized by domain
- **App**: Expo Router-based navigation with role-based screens

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Design Principles

- **Dark-first, minimal, authoritative UI**: Inspired by medical instruments and aviation dashboards
- **Trust-first architecture**: Cryptographic integrity and blockchain anchoring
- **Role-based access control**: Distinct experiences for each role
- **Immutable event logs**: Versioned medical facts with Git-like history
- **Consent-as-code**: Machine-readable and human-readable consent management

## Technology Stack

- **Expo** (~51.0.0) - React Native framework
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing
- **Zustand** - State management
- **React Query** - Server state management (configured but not extensively used)
- **Expo SecureStore** - Secure storage
- **Expo Crypto** - Cryptographic operations

## Development Notes

### Asset Files

The following asset files need to be created:
- `assets/icon.png` (1024x1024)
- `assets/splash.png`
- `assets/adaptive-icon.png`
- `assets/favicon.png`

These can be generated using Expo's asset generation tools.

### Mock Data

Currently uses mock data for development. In production:
- Replace mock API calls with real backend integration
- Implement real blockchain anchoring
- Add proper authentication flow
- Integrate with identity providers

## Key Concepts

### Medical Fact Object (MFO)

Each medical fact includes:
- Fact type (diagnosis, lab, prescription, etc.)
- Issuer (doctor/lab/system)
- Timestamp
- Confidence level
- Version history
- Linked consent
- Verification status

### Consent as Code

- Time-bound
- Purpose-bound
- Revocable
- Human-readable + machine-readable
- Audit trail

### Medical Timeline

- Immutable sequence of medical assertions
- Corrections append, never delete
- Clear visual diff between versions
- Git-like version control

## Role-Based Experiences

- **Patient**: View timeline, manage consent, view profile
- **Doctor**: Create medical facts, view patient records
- **Lab**: Upload lab results
- **Insurer**: View records with consent
- **Auditor**: Audit and verify records

## Security & Compliance

- Secure storage for authentication
- Cryptographic hashing for integrity
- Blockchain anchoring for immutability
- Consent-aware data access
- Audit logging

## Contributing

This is an enterprise-grade application designed for production use. Code quality, type safety, and security are paramount.

## License

Private - All rights reserved

