import { NextRequest, NextResponse } from 'next/server';
import { helpService } from '@/lib/services/supabase';
import { neynarService } from '@/lib/services/neynar';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const course = searchParams.get('course');

    const helpRequests = await helpService.getHelpRequests(
      status || undefined,
      course || undefined
    );

    return NextResponse.json({
      success: true,
      helpRequests,
    });
  } catch (error) {
    console.error('Get help requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch help requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      title,
      description,
      course,
      subject,
      urgency,
      postOnFarcaster,
      signerUuid,
    } = await request.json();

    if (!userId || !title || !description || !subject || !urgency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create help request
    const helpRequest = await helpService.createHelpRequest({
      requestId: uuidv4(),
      userId,
      title,
      description,
      course,
      subject,
      urgency,
      status: 'open',
    });

    // Post on Farcaster if requested
    if (postOnFarcaster && signerUuid) {
      try {
        await neynarService.postHelpRequest(
          signerUuid,
          subject,
          description,
          urgency
        );
      } catch (error) {
        console.error('Failed to post on Farcaster:', error);
        // Don't fail the entire request if Farcaster posting fails
      }
    }

    return NextResponse.json({
      success: true,
      helpRequest,
    });
  } catch (error) {
    console.error('Create help request error:', error);
    return NextResponse.json(
      { error: 'Failed to create help request' },
      { status: 500 }
    );
  }
}
