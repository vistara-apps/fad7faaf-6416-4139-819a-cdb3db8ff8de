import { NextRequest, NextResponse } from 'next/server';
import { circleService } from '@/lib/services/supabase';
import { neynarService } from '@/lib/services/neynar';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');

    let circles;

    if (search) {
      circles = await circleService.searchCircles(search, topic || undefined);
    } else {
      circles = await circleService.getCircles(userId || undefined, topic || undefined);
    }

    return NextResponse.json({
      success: true,
      circles,
    });
  } catch (error) {
    console.error('Get circles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch circles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      topic,
      createdBy,
      isPrivate,
      announceOnFarcaster,
      signerUuid,
    } = await request.json();

    if (!name || !description || !topic || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create circle
    const circle = await circleService.createCircle({
      circleId: uuidv4(),
      name,
      description,
      topic,
      members: [createdBy],
      createdBy,
      isPrivate: isPrivate || false,
    });

    // Announce on Farcaster if requested and not private
    if (announceOnFarcaster && !isPrivate && signerUuid) {
      try {
        await neynarService.postCircleInvite(
          signerUuid,
          name,
          topic,
          description
        );
      } catch (error) {
        console.error('Failed to announce on Farcaster:', error);
        // Don't fail the entire request if Farcaster posting fails
      }
    }

    return NextResponse.json({
      success: true,
      circle,
    });
  } catch (error) {
    console.error('Create circle error:', error);
    return NextResponse.json(
      { error: 'Failed to create circle' },
      { status: 500 }
    );
  }
}
