import { NextRequest, NextResponse } from 'next/server';
import { farcasterHelpers, formatFarcasterUser } from '@/lib/neynar';
import { supabaseHelpers } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, signature, message } = body;

    if (!fid) {
      return NextResponse.json(
        { error: 'Farcaster ID is required' },
        { status: 400 }
      );
    }

    // Get user data from Farcaster
    const farcasterUser = await farcasterHelpers.getUserByFid(parseInt(fid));
    
    if (!farcasterUser) {
      return NextResponse.json(
        { error: 'User not found on Farcaster' },
        { status: 404 }
      );
    }

    // Format user data for our application
    const formattedUser = formatFarcasterUser(farcasterUser);

    // Check if user already exists in our database
    let user = await supabaseHelpers.getUserByFarcasterId(formattedUser.farcaster_id);

    if (!user) {
      // Create new user in our database
      user = await supabaseHelpers.createUser({
        farcaster_id: formattedUser.farcaster_id,
        display_name: formattedUser.display_name,
        bio: formattedUser.bio,
        avatar: formattedUser.avatar,
        interests: [],
        courses: [],
      });
    }

    // Return user data and authentication success
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        farcaster_id: user.farcaster_id,
        display_name: user.display_name,
        bio: user.bio,
        interests: user.interests || [],
        courses: user.courses || [],
        avatar: user.avatar,
        created_at: user.created_at,
      },
      farcaster_data: {
        username: formattedUser.username,
        follower_count: formattedUser.follower_count,
        following_count: formattedUser.following_count,
        verified: formattedUser.verified,
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { error: 'Farcaster ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists in our database
    const user = await supabaseHelpers.getUserByFarcasterId(fid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        farcaster_id: user.farcaster_id,
        display_name: user.display_name,
        bio: user.bio,
        interests: user.interests || [],
        courses: user.courses || [],
        avatar: user.avatar,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('User lookup error:', error);
    return NextResponse.json(
      { error: 'User lookup failed' },
      { status: 500 }
    );
  }
}
