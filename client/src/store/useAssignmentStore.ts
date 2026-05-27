import { create } from 'zustand';
import api from '@/lib/api';
import { Assignment, CreateFormData, GenerationStatus } from '@/types';

interface AssignmentStore {
  // Assignments list
  assignments: Assignment[];
  loading: boolean;
  searchQuery: string;

  // Create form state
  formData: CreateFormData;
  currentStep: number;

  // Generation status per assignment
  generationStatus: Record<string, GenerationStatus>;

  // Current assignment being viewed
  currentAssignment: Assignment | null;
  currentLoading: boolean;

  // Actions
  fetchAssignments: () => Promise<void>;
  createAssignment: (data: FormData) => Promise<string>;
  deleteAssignment: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  updateFormData: (data: Partial<CreateFormData>) => void;
  resetFormData: () => void;
  setCurrentStep: (step: number) => void;
  setGenerationStatus: (id: string, status: GenerationStatus) => void;
  fetchAssignment: (id: string) => Promise<void>;
  regenerateAssignment: (id: string) => Promise<void>;
  setCurrentAssignment: (assignment: Assignment | null) => void;
}

const defaultFormData: CreateFormData = {
  questionTypes: [
    { type: 'Multiple Choice Questions', count: 4, marksEach: 1 },
    { type: 'Short Questions', count: 3, marksEach: 2 },
  ],
  additionalInstructions: '',
  dueDate: '',
  subject: '',
  className: '',
  schoolName: '',
  file: null,
};

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  // State
  assignments: [],
  loading: false,
  searchQuery: '',
  formData: { ...defaultFormData },
  currentStep: 0,
  generationStatus: {},
  currentAssignment: null,
  currentLoading: false,

  // Actions
  fetchAssignments: async () => {
    set({ loading: true });
    try {
      const { searchQuery } = get();
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get('/assignments', { params });
      set({ assignments: response.data.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      set({ loading: false });
    }
  },

  createAssignment: async (formData: FormData) => {
    try {
      const response = await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { id } = response.data.data;
      set((state) => ({
        generationStatus: {
          ...state.generationStatus,
          [id]: { status: 'pending', message: 'Assignment created, queuing generation...' },
        },
      }));
      return id;
    } catch (error: any) {
      console.error('Failed to create assignment:', error);
      throw new Error(error.response?.data?.error || 'Failed to create assignment');
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await api.delete(`/assignments/${id}`);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      throw error;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  updateFormData: (data: Partial<CreateFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  resetFormData: () => {
    set({ formData: { ...defaultFormData }, currentStep: 0 });
  },

  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  setGenerationStatus: (id: string, status: GenerationStatus) => {
    set((state) => ({
      generationStatus: {
        ...state.generationStatus,
        [id]: status,
      },
    }));
  },

  fetchAssignment: async (id: string) => {
    set({ currentLoading: true });
    try {
      const response = await api.get(`/assignments/${id}`);
      set({ currentAssignment: response.data.data, currentLoading: false });
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      set({ currentLoading: false });
    }
  },

  regenerateAssignment: async (id: string) => {
    try {
      await api.post(`/assignments/${id}/regenerate`);
      set((state) => ({
        generationStatus: {
          ...state.generationStatus,
          [id]: { status: 'pending', message: 'Regeneration started...' },
        },
        currentAssignment: state.currentAssignment
          ? { ...state.currentAssignment, status: 'pending', generatedPaper: undefined }
          : null,
      }));
    } catch (error) {
      console.error('Failed to regenerate:', error);
      throw error;
    }
  },

  setCurrentAssignment: (assignment: Assignment | null) => {
    set({ currentAssignment: assignment });
  },
}));
