import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const neynarApiKey = process.env.NEYNAR_API_KEY;

if (!neynarApiKey) {
  throw new Error('NEYNAR_API_KEY environment variable is required');
}

// Initialize Neynar client
export const neynar = new NeynarAPIClient(neynarApiKey);

// Helper functions for Farcaster operations
export const farcasterHelpers = {
  // Get user information by FID
  async getUserByFid(fid: number) {
    try {
      const response = await neynar.lookupUserByFid(fid);
      return response.result?.user || null;
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      return null;
    }
  },

  // Get user information by username
  async getUserByUsername(username: string) {
    try {
      const response = await neynar.lookupUserByUsername(username);
      return response.result?.user || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  // Search for users
  async searchUsers(query: string, limit: number = 10) {
    try {
      const response = await neynar.searchUser(query, limit);
      return response.result?.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  // Get user's followers
  async getUserFollowers(fid: number, limit: number = 20) {
    try {
      const response = await neynar.fetchUserFollowers(fid, { limit });
      return response.result?.users || [];
    } catch (error) {
      console.error('Error fetching user followers:', error);
      return [];
    }
  },

  // Get user's following
  async getUserFollowing(fid: number, limit: number = 20) {
    try {
      const response = await neynar.fetchUserFollowing(fid, { limit });
      return response.result?.users || [];
    } catch (error) {
      console.error('Error fetching user following:', error);
      return [];
    }
  },

  // Post a cast (message) to Farcaster
  async publishCast(
    signerUuid: string,
    text: string,
    options?: {
      replyTo?: string;
      channelId?: string;
      embeds?: Array<{ url: string }>;
    }
  ) {
    try {
      const response = await neynar.publishCast(signerUuid, text, {
        replyTo: options?.replyTo,
        channelId: options?.channelId,
        embeds: options?.embeds,
      });
      return response.result;
    } catch (error) {
      console.error('Error publishing cast:', error);
      throw error;
    }
  },

  // Get casts from a user
  async getUserCasts(fid: number, limit: number = 25) {
    try {
      const response = await neynar.fetchCastsForUser(fid, { limit });
      return response.result?.casts || [];
    } catch (error) {
      console.error('Error fetching user casts:', error);
      return [];
    }
  },

  // Get cast by hash
  async getCastByHash(hash: string) {
    try {
      const response = await neynar.lookUpCastByHash(hash);
      return response.result?.cast || null;
    } catch (error) {
      console.error('Error fetching cast by hash:', error);
      return null;
    }
  },

  // Get trending casts
  async getTrendingCasts(limit: number = 25, timeWindow: '1h' | '6h' | '24h' = '24h') {
    try {
      const response = await neynar.fetchTrendingCasts({ limit, timeWindow });
      return response.result?.casts || [];
    } catch (error) {
      console.error('Error fetching trending casts:', error);
      return [];
    }
  },

  // React to a cast (like/recast)
  async reactToCast(
    signerUuid: string,
    reactionType: 'like' | 'recast',
    target: string
  ) {
    try {
      const response = await neynar.reactToCast(signerUuid, reactionType, target);
      return response.result;
    } catch (error) {
      console.error('Error reacting to cast:', error);
      throw error;
    }
  },

  // Follow a user
  async followUser(signerUuid: string, targetFid: number) {
    try {
      const response = await neynar.followUser(signerUuid, targetFid);
      return response.result;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(signerUuid: string, targetFid: number) {
    try {
      const response = await neynar.unfollowUser(signerUuid, targetFid);
      return response.result;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  // Get channel information
  async getChannel(channelId: string) {
    try {
      const response = await neynar.lookupChannel(channelId);
      return response.result?.channel || null;
    } catch (error) {
      console.error('Error fetching channel:', error);
      return null;
    }
  },

  // Get casts from a channel
  async getChannelCasts(channelId: string, limit: number = 25) {
    try {
      const response = await neynar.fetchCastsForChannel(channelId, { limit });
      return response.result?.casts || [];
    } catch (error) {
      console.error('Error fetching channel casts:', error);
      return [];
    }
  },

  // Validate Farcaster signature (for authentication)
  async validateFrameAction(messageBytes: string) {
    try {
      const response = await neynar.validateFrameAction(messageBytes);
      return response.result;
    } catch (error) {
      console.error('Error validating frame action:', error);
      return null;
    }
  },
};

// Helper function to format user data for our application
export function formatFarcasterUser(farcasterUser: any) {
  return {
    farcaster_id: farcasterUser.fid.toString(),
    display_name: farcasterUser.display_name || farcasterUser.username,
    bio: farcasterUser.profile?.bio?.text || '',
    avatar: farcasterUser.pfp_url || '',
    username: farcasterUser.username,
    follower_count: farcasterUser.follower_count || 0,
    following_count: farcasterUser.following_count || 0,
    verified: farcasterUser.power_badge || false,
  };
}

// Helper function to create study group announcement cast
export function createStudyGroupAnnouncementText(
  groupName: string,
  course: string,
  description: string,
  appUrl: string
) {
  return `🎓 New Study Group: "${groupName}"

📚 Course: ${course}
📝 ${description}

Join us on EduConnect to collaborate and learn together! 

${appUrl}

#StudyGroup #${course.replace(/\s+/g, '')} #EduConnect`;
}

// Helper function to create help request cast
export function createHelpRequestText(
  title: string,
  subject: string,
  urgency: string,
  appUrl: string
) {
  const urgencyEmoji = urgency === 'high' ? '🚨' : urgency === 'medium' ? '⚡' : '💡';
  
  return `${urgencyEmoji} Need Help: ${title}

📖 Subject: ${subject}
🔥 Urgency: ${urgency}

Can you help? Join the discussion on EduConnect!

${appUrl}

#StudyHelp #${subject.replace(/\s+/g, '')} #EduConnect`;
}
