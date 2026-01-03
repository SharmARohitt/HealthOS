/**
 * Truth store - Manages medical facts and timeline state
 */

import { create } from 'zustand';
import type { MedicalFact, MedicalTimeline, FactVersion } from '@/types';

interface TruthState {
  timeline: MedicalTimeline | null;
  facts: MedicalFact[];
  selectedFact: MedicalFact | null;
  factVersions: Record<string, FactVersion[]>; // factId -> versions
  
  // Actions
  setTimeline: (timeline: MedicalTimeline) => void;
  addFact: (fact: MedicalFact) => void;
  updateFact: (fact: MedicalFact) => void;
  setSelectedFact: (fact: MedicalFact | null) => void;
  addFactVersion: (factId: string, version: FactVersion) => void;
  getFactVersions: (factId: string) => FactVersion[];
  clearTimeline: () => void;
}

export const useTruthStore = create<TruthState>((set, get) => ({
  timeline: null,
  facts: [],
  selectedFact: null,
  factVersions: {},

  setTimeline: (timeline: MedicalTimeline) => {
    set({
      timeline,
      facts: timeline.facts,
    });
  },

  addFact: (fact: MedicalFact) => {
    const { facts, timeline } = get();
    const updatedFacts = [...facts, fact].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    set({ facts: updatedFacts });
    
    if (timeline) {
      set({
        timeline: {
          ...timeline,
          facts: updatedFacts,
          lastUpdated: new Date(),
        },
      });
    }
  },

  updateFact: (fact: MedicalFact) => {
    const { facts } = get();
    const updatedFacts = facts.map((f) => (f.id === fact.id ? fact : f));
    
    set({ facts: updatedFacts });
  },

  setSelectedFact: (fact: MedicalFact | null) => {
    set({ selectedFact: fact });
  },

  addFactVersion: (factId: string, version: FactVersion) => {
    const { factVersions } = get();
    const versions = factVersions[factId] || [];
    set({
      factVersions: {
        ...factVersions,
        [factId]: [...versions, version],
      },
    });
  },

  getFactVersions: (factId: string) => {
    const { factVersions } = get();
    return factVersions[factId] || [];
  },

  clearTimeline: () => {
    set({
      timeline: null,
      facts: [],
      selectedFact: null,
      factVersions: {},
    });
  },
}));

