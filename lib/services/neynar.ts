import axios from 'axios';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
const NEYNAR_BASE_URL = 'https://api.neynar.com';

const neynarClient = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'api_key': NEYNAR_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio: {
    text: string;
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
}

export interface Cast {
  hash: string;
  thread_hash: string;
  parent_hash?: string;
  parent_url?: string;
  root_parent_url?: string;
  parent_author?: {
    fid: number;
  };
  author: FarcasterUser;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: any[];
    recasts: any[];
  };
  replies: {
    count: number;
  };
  mentioned_profiles: FarcasterUser[];
}

export interface CastResponse {
  cast: Cast;
}

export interface UserSearchResponse {
  result: {
    users: FarcasterUser[];
  };
}

export interface UserResponse {
  user: FarcasterUser;
}

export const neynarService = {
  // User operations
  async getUserByFid(fid: number): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get<UserResponse>(`/v2/user/bulk?fids=${fid}`);
      return response.data.user || null;
    } catch (error) {
      console.error('Failed to get user by FID:', error);
      return null;
    }
  },

  async getUserByUsername(username: string): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get<UserResponse>(`/v2/user/by_username?username=${username}`);
      return response.data.user || null;
    } catch (error) {
      console.error('Failed to get user by username:', error);
      return null;
    }
  },

  async searchUsers(query: string, limit = 10): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get<UserSearchResponse>(
        `/v2/user/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      return response.data.result.users || [];
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  },

  // Cast operations
  async publishCast(
    text: string,
    signerUuid: string,
    parentHash?: string,
    parentUrl?: string
  ): Promise<Cast | null> {
    try {
      const payload: any = {
        signer_uuid: signerUuid,
        text,
      };

      if (parentHash) {
        payload.parent = parentHash;
      } else if (parentUrl) {
        payload.parent = parentUrl;
      }

      const response = await neynarClient.post<CastResponse>('/v2/casts', payload);
      return response.data.cast;
    } catch (error) {
      console.error('Failed to publish cast:', error);
      return null;
    }
  },

  async getCastByHash(hash: string): Promise<Cast | null> {
    try {
      const response = await neynarClient.get<CastResponse>(`/v2/casts?casts=${hash}`);
      return response.data.cast || null;
    } catch (error) {
      console.error('Failed to get cast by hash:', error);
      return null;
    }
  },

  async getCastsByUser(fid: number, limit = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(
        `/v2/casts?fid=${fid}&limit=${limit}&include_replies=false`
      );
      return response.data.casts || [];
    } catch (error) {
      console.error('Failed to get casts by user:', error);
      return [];
    }
  },

  async getFeedByFollowing(fid: number, limit = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(
        `/v2/feed/following?fid=${fid}&limit=${limit}`
      );
      return response.data.casts || [];
    } catch (error) {
      console.error('Failed to get following feed:', error);
      return [];
    }
  },

  // Channel operations (for study groups and circles)
  async getChannelByUrl(url: string): Promise<any> {
    try {
      const response = await neynarClient.get(`/v2/channel?id=${encodeURIComponent(url)}`);
      return response.data.channel || null;
    } catch (error) {
      console.error('Failed to get channel:', error);
      return null;
    }
  },

  async getCastsByChannel(channelId: string, limit = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(
        `/v2/casts?channel_id=${channelId}&limit=${limit}`
      );
      return response.data.casts || [];
    } catch (error) {
      console.error('Failed to get casts by channel:', error);
      return [];
    }
  },

  // Notification operations
  async getNotifications(fid: number, limit = 25): Promise<any[]> {
    try {
      const response = await neynarClient.get(
        `/v2/notifications?fid=${fid}&limit=${limit}`
      );
      return response.data.notifications || [];
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  },

  // Reaction operations
  async likeCast(signerUuid: string, castHash: string): Promise<boolean> {
    try {
      await neynarClient.post('/v2/reactions', {
        signer_uuid: signerUuid,
        reaction_type: 'like',
        target: castHash,
      });
      return true;
    } catch (error) {
      console.error('Failed to like cast:', error);
      return false;
    }
  },

  async recastCast(signerUuid: string, castHash: string): Promise<boolean> {
    try {
      await neynarClient.post('/v2/reactions', {
        signer_uuid: signerUuid,
        reaction_type: 'recast',
        target: castHash,
      });
      return true;
    } catch (error) {
      console.error('Failed to recast:', error);
      return false;
    }
  },

  // Follow operations
  async followUser(signerUuid: string, targetFid: number): Promise<boolean> {
    try {
      await neynarClient.post('/v2/follows', {
        signer_uuid: signerUuid,
        target_fids: [targetFid],
      });
      return true;
    } catch (error) {
      console.error('Failed to follow user:', error);
      return false;
    }
  },

  async unfollowUser(signerUuid: string, targetFid: number): Promise<boolean> {
    try {
      await neynarClient.delete('/v2/follows', {
        data: {
          signer_uuid: signerUuid,
          target_fids: [targetFid],
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      return false;
    }
  },

  // Utility functions for EduConnect
  async postStudyGroupAnnouncement(
    signerUuid: string,
    groupName: string,
    course: string,
    description: string
  ): Promise<Cast | null> {
    const text = `📚 New Study Group: ${groupName}\n\n🎓 Course: ${course}\n📝 ${description}\n\nJoin us on EduConnect! #StudyGroup #${course.replace(/\s+/g, '')}`;
    return this.publishCast(text, signerUuid);
  },

  async postHelpRequest(
    signerUuid: string,
    subject: string,
    description: string,
    urgency: string
  ): Promise<Cast | null> {
    const urgencyEmoji = urgency === 'high' ? '🚨' : urgency === 'medium' ? '⚡' : '💡';
    const text = `${urgencyEmoji} Need Help: ${subject}\n\n${description}\n\nCan anyone help? Reply or find me on EduConnect! #StudyHelp #${subject.replace(/\s+/g, '')}`;
    return this.publishCast(text, signerUuid);
  },

  async postCircleInvite(
    signerUuid: string,
    circleName: string,
    topic: string,
    description: string
  ): Promise<Cast | null> {
    const text = `🌟 Join our Circle: ${circleName}\n\n🎯 Topic: ${topic}\n✨ ${description}\n\nConnect with like-minded people on EduConnect! #Circle #${topic.replace(/\s+/g, '')}`;
    return this.publishCast(text, signerUuid);
  },
};
