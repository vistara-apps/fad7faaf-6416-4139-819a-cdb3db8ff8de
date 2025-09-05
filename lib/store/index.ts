import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, StudyGroup, Circle, HelpRequest } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  farcasterId: string | null;
  privyUser: any | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setFarcasterId: (id: string | null) => void;
  setPrivyUser: (user: any) => void;
  logout: () => void;
}

interface AppState {
  studyGroups: StudyGroup[];
  circles: Circle[];
  helpRequests: HelpRequest[];
  activeTab: string;
  searchQuery: string;
  selectedCourse: string;
  selectedTopic: string;
  setStudyGroups: (groups: StudyGroup[]) => void;
  setCircles: (circles: Circle[]) => void;
  setHelpRequests: (requests: HelpRequest[]) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCourse: (course: string) => void;
  setSelectedTopic: (topic: string) => void;
  addStudyGroup: (group: StudyGroup) => void;
  addCircle: (circle: Circle) => void;
  addHelpRequest: (request: HelpRequest) => void;
  updateStudyGroup: (groupId: string, updates: Partial<StudyGroup>) => void;
  updateCircle: (circleId: string, updates: Partial<Circle>) => void;
  updateHelpRequest: (requestId: string, updates: Partial<HelpRequest>) => void;
}

interface UIState {
  isModalOpen: boolean;
  modalType: 'create-group' | 'create-circle' | 'create-help' | 'profile' | null;
  isLoading: boolean;
  error: string | null;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  };
  setModalOpen: (open: boolean, type?: 'create-group' | 'create-circle' | 'create-help' | 'profile') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      farcasterId: null,
      privyUser: null,
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setFarcasterId: (id) => set({ farcasterId: id }),
      setPrivyUser: (user) => set({ privyUser: user }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        farcasterId: null,
        privyUser: null,
      }),
    }),
    {
      name: 'educonnect-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        farcasterId: state.farcasterId,
      }),
    }
  )
);

// App State Store
export const useAppStore = create<AppState>((set, get) => ({
  studyGroups: [],
  circles: [],
  helpRequests: [],
  activeTab: 'dashboard',
  searchQuery: '',
  selectedCourse: '',
  selectedTopic: '',
  setStudyGroups: (groups) => set({ studyGroups: groups }),
  setCircles: (circles) => set({ circles }),
  setHelpRequests: (requests) => set({ helpRequests: requests }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  addStudyGroup: (group) => set((state) => ({
    studyGroups: [group, ...state.studyGroups]
  })),
  addCircle: (circle) => set((state) => ({
    circles: [circle, ...state.circles]
  })),
  addHelpRequest: (request) => set((state) => ({
    helpRequests: [request, ...state.helpRequests]
  })),
  updateStudyGroup: (groupId, updates) => set((state) => ({
    studyGroups: state.studyGroups.map(group =>
      group.groupId === groupId ? { ...group, ...updates } : group
    )
  })),
  updateCircle: (circleId, updates) => set((state) => ({
    circles: state.circles.map(circle =>
      circle.circleId === circleId ? { ...circle, ...updates } : circle
    )
  })),
  updateHelpRequest: (requestId, updates) => set((state) => ({
    helpRequests: state.helpRequests.map(request =>
      request.requestId === requestId ? { ...request, ...updates } : request
    )
  })),
}));

// UI State Store
export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalType: null,
  isLoading: false,
  error: null,
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
  setModalOpen: (open, type) => set({
    isModalOpen: open,
    modalType: open ? type || null : null,
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  showToast: (message, type) => set({
    toast: { message, type, visible: true }
  }),
  hideToast: () => set((state) => ({
    toast: { ...state.toast, visible: false }
  })),
}));

// Computed selectors
export const useUserStudyGroups = () => {
  const { studyGroups } = useAppStore();
  const { user } = useAuthStore();
  
  return studyGroups.filter(group => 
    user && group.members.includes(user.userId)
  );
};

export const useUserCircles = () => {
  const { circles } = useAppStore();
  const { user } = useAuthStore();
  
  return circles.filter(circle => 
    user && circle.members.includes(user.userId)
  );
};

export const useFilteredStudyGroups = () => {
  const { studyGroups, searchQuery, selectedCourse } = useAppStore();
  
  return studyGroups.filter(group => {
    const matchesSearch = !searchQuery || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = !selectedCourse || group.course === selectedCourse;
    
    return matchesSearch && matchesCourse && group.isActive;
  });
};

export const useFilteredCircles = () => {
  const { circles, searchQuery, selectedTopic } = useAppStore();
  
  return circles.filter(circle => {
    const matchesSearch = !searchQuery || 
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = !selectedTopic || circle.topic === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });
};

export const useFilteredHelpRequests = () => {
  const { helpRequests, searchQuery, selectedCourse } = useAppStore();
  
  return helpRequests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = !selectedCourse || request.course === selectedCourse;
    
    return matchesSearch && matchesCourse && request.status === 'open';
  });
};
