import { NextRequest, NextResponse } from 'next/server';
import { neynarService } from '@/lib/services/neynar';
import { userService } from '@/lib/services/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { fid, username } = await request.json();

    if (!fid && !username) {
      return NextResponse.json(
        { error: 'Either FID or username is required' },
        { status: 400 }
      );
    }

    // Get user from Farcaster
    let farcasterUser;
    if (fid) {
      farcasterUser = await neynarService.getUserByFid(fid);
    } else {
      farcasterUser = await neynarService.getUserByUsername(username);
    }

    if (!farcasterUser) {
      return NextResponse.json(
        { error: 'User not found on Farcaster' },
        { status: 404 }
      );
    }

    // Check if user exists in our database
    let user = await userService.getUserByFarcasterId(farcasterUser.fid.toString());

    if (!user) {
      // Create new user
      user = await userService.createUser({
        userId: uuidv4(),
        farcasterId: farcasterUser.fid.toString(),
        displayName: farcasterUser.display_name || farcasterUser.username,
        bio: farcasterUser.bio?.text || '',
        interests: [],
        courses: [],
        avatar: farcasterUser.pfp_url,
      });
    }

    return NextResponse.json({
      success: true,
      user,
      farcasterUser,
    });
  } catch (error) {
    console.error('Farcaster auth error:', error);
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
    const username = searchParams.get('username');

    if (!fid && !username) {
      return NextResponse.json(
        { error: 'Either FID or username is required' },
        { status: 400 }
      );
    }

    let farcasterUser;
    if (fid) {
      farcasterUser = await neynarService.getUserByFid(parseInt(fid));
    } else {
      farcasterUser = await neynarService.getUserByUsername(username!);
    }

    if (!farcasterUser) {
      return NextResponse.json(
        { error: 'User not found on Farcaster' },
        { status: 404 }
      );
    }

    // Get user from our database
    const user = await userService.getUserByFarcasterId(farcasterUser.fid.toString());

    return NextResponse.json({
      success: true,
      user,
      farcasterUser,
    });
  } catch (error) {
    console.error('Farcaster user fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
