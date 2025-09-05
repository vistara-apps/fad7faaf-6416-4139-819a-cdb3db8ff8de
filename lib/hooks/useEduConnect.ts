import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useAppStore } from '../store';
import { StudyGroup, Circle, HelpRequest } from '../types';
import axios from 'axios';
import toast from 'react-hot-toast';

// API client
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Query keys
const QUERY_KEYS = {
  studyGroups: 'studyGroups',
  circles: 'circles',
  helpRequests: 'helpRequests',
  userStudyGroups: 'userStudyGroups',
  userCircles: 'userCircles',
} as const;

export function useEduConnect() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const {
    setStudyGroups,
    setCircles,
    setHelpRequests,
    addStudyGroup,
    addCircle,
    addHelpRequest,
    updateStudyGroup,
    updateCircle,
    updateHelpRequest,
  } = useAppStore();

  // Study Groups Queries
  const {
    data: studyGroups = [],
    isLoading: studyGroupsLoading,
    error: studyGroupsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.studyGroups],
    queryFn: async () => {
      const response = await api.get('/study-groups');
      const groups = response.data.studyGroups;
      setStudyGroups(groups);
      return groups;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: userStudyGroups = [],
    isLoading: userStudyGroupsLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.userStudyGroups, user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/study-groups?userId=${user.userId}`);
      return response.data.studyGroups;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Circles Queries
  const {
    data: circles = [],
    isLoading: circlesLoading,
    error: circlesError,
  } = useQuery({
    queryKey: [QUERY_KEYS.circles],
    queryFn: async () => {
      const response = await api.get('/circles');
      const circlesData = response.data.circles;
      setCircles(circlesData);
      return circlesData;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: userCircles = [],
    isLoading: userCirclesLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.userCircles, user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/circles?userId=${user.userId}`);
      return response.data.circles;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Help Requests Queries
  const {
    data: helpRequests = [],
    isLoading: helpRequestsLoading,
    error: helpRequestsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.helpRequests],
    queryFn: async () => {
      const response = await api.get('/help-requests?status=open');
      const requests = response.data.helpRequests;
      setHelpRequests(requests);
      return requests;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Study Group Mutations
  const createStudyGroupMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      course: string;
      maxMembers?: number;
      scheduleLink?: string;
      announceOnFarcaster?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post('/study-groups', {
        ...data,
        createdBy: user.userId,
      });
      return response.data.studyGroup;
    },
    onSuccess: (newGroup: StudyGroup) => {
      addStudyGroup(newGroup);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyGroups] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStudyGroups] });
      toast.success('Study group created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create study group');
    },
  });

  const joinStudyGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post(`/study-groups/${groupId}/join`, {
        userId: user.userId,
      });
      return response.data.studyGroup;
    },
    onSuccess: (updatedGroup: StudyGroup) => {
      updateStudyGroup(updatedGroup.groupId, updatedGroup);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyGroups] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStudyGroups] });
      toast.success('Successfully joined study group!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to join study group');
    },
  });

  const leaveStudyGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.delete(`/study-groups/${groupId}/join?userId=${user.userId}`);
      return response.data.studyGroup;
    },
    onSuccess: (updatedGroup: StudyGroup) => {
      updateStudyGroup(updatedGroup.groupId, updatedGroup);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyGroups] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStudyGroups] });
      toast.success('Successfully left study group');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to leave study group');
    },
  });

  // Circle Mutations
  const createCircleMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      topic: string;
      isPrivate?: boolean;
      announceOnFarcaster?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post('/circles', {
        ...data,
        createdBy: user.userId,
      });
      return response.data.circle;
    },
    onSuccess: (newCircle: Circle) => {
      addCircle(newCircle);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.circles] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userCircles] });
      toast.success('Circle created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create circle');
    },
  });

  const joinCircleMutation = useMutation({
    mutationFn: async (circleId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post(`/circles/${circleId}/join`, {
        userId: user.userId,
      });
      return response.data.circle;
    },
    onSuccess: (updatedCircle: Circle) => {
      updateCircle(updatedCircle.circleId, updatedCircle);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.circles] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userCircles] });
      toast.success('Successfully joined circle!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to join circle');
    },
  });

  const leaveCircleMutation = useMutation({
    mutationFn: async (circleId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.delete(`/circles/${circleId}/join?userId=${user.userId}`);
      return response.data.circle;
    },
    onSuccess: (updatedCircle: Circle) => {
      updateCircle(updatedCircle.circleId, updatedCircle);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.circles] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userCircles] });
      toast.success('Successfully left circle');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to leave circle');
    },
  });

  // Help Request Mutations
  const createHelpRequestMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      course?: string;
      subject: string;
      urgency: 'low' | 'medium' | 'high';
      postOnFarcaster?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post('/help-requests', {
        ...data,
        userId: user.userId,
      });
      return response.data.helpRequest;
    },
    onSuccess: (newRequest: HelpRequest) => {
      addHelpRequest(newRequest);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.helpRequests] });
      toast.success('Help request created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create help request');
    },
  });

  // Search functions
  const searchStudyGroups = async (query: string, course?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      if (course) params.append('course', course);
      
      const response = await api.get(`/study-groups?${params.toString()}`);
      return response.data.studyGroups;
    } catch (error) {
      console.error('Search study groups error:', error);
      return [];
    }
  };

  const searchCircles = async (query: string, topic?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      if (topic) params.append('topic', topic);
      
      const response = await api.get(`/circles?${params.toString()}`);
      return response.data.circles;
    } catch (error) {
      console.error('Search circles error:', error);
      return [];
    }
  };

  return {
    // Data
    studyGroups,
    circles,
    helpRequests,
    userStudyGroups,
    userCircles,

    // Loading states
    isLoading: studyGroupsLoading || circlesLoading || helpRequestsLoading,
    studyGroupsLoading,
    circlesLoading,
    helpRequestsLoading,
    userStudyGroupsLoading,
    userCirclesLoading,

    // Errors
    studyGroupsError,
    circlesError,
    helpRequestsError,

    // Actions
    createStudyGroup: createStudyGroupMutation.mutate,
    joinStudyGroup: joinStudyGroupMutation.mutate,
    leaveStudyGroup: leaveStudyGroupMutation.mutate,
    createCircle: createCircleMutation.mutate,
    joinCircle: joinCircleMutation.mutate,
    leaveCircle: leaveCircleMutation.mutate,
    createHelpRequest: createHelpRequestMutation.mutate,

    // Search
    searchStudyGroups,
    searchCircles,

    // Mutation states
    isCreatingStudyGroup: createStudyGroupMutation.isPending,
    isJoiningStudyGroup: joinStudyGroupMutation.isPending,
    isLeavingStudyGroup: leaveStudyGroupMutation.isPending,
    isCreatingCircle: createCircleMutation.isPending,
    isJoiningCircle: joinCircleMutation.isPending,
    isLeavingCircle: leaveCircleMutation.isPending,
    isCreatingHelpRequest: createHelpRequestMutation.isPending,

    // Refresh functions
    refreshStudyGroups: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyGroups] }),
    refreshCircles: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.circles] }),
    refreshHelpRequests: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.helpRequests] }),
  };
}
