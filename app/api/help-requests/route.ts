import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';
import { farcasterHelpers, createHelpRequestText } from '@/lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const course = searchParams.get('course');

    const filters: { status?: string; course?: string } = {};
    if (status) filters.status = status;
    if (course) filters.course = course;

    const helpRequests = await supabaseHelpers.getHelpRequests(filters);

    return NextResponse.json({
      success: true,
      data: helpRequests,
    });
  } catch (error) {
    console.error('Error fetching help requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch help requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      title,
      description,
      course,
      subject,
      urgency = 'medium',
      announce_on_farcaster = false,
      signer_uuid,
    } = body;

    // Validate required fields
    if (!user_id || !title || !description || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, title, description, subject' },
        { status: 400 }
      );
    }

    // Validate urgency level
    if (!['low', 'medium', 'high'].includes(urgency)) {
      return NextResponse.json(
        { error: 'Invalid urgency level. Must be low, medium, or high' },
        { status: 400 }
      );
    }

    // Create help request in database
    const helpRequest = await supabaseHelpers.createHelpRequest({
      user_id,
      title,
      description,
      course,
      subject,
      urgency,
    });

    // Optionally announce on Farcaster
    let castResult = null;
    if (announce_on_farcaster && signer_uuid) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://educonnect.app';
        const castText = createHelpRequestText(
          title,
          subject,
          urgency,
          appUrl
        );

        castResult = await farcasterHelpers.publishCast(signer_uuid, castText, {
          embeds: [{ url: appUrl }],
        });
      } catch (castError) {
        console.error('Failed to announce on Farcaster:', castError);
        // Don't fail the entire request if cast fails
      }
    }

    return NextResponse.json({
      success: true,
      data: helpRequest,
      cast_result: castResult,
    });
  } catch (error) {
    console.error('Error creating help request:', error);
    return NextResponse.json(
      { error: 'Failed to create help request' },
      { status: 500 }
    );
  }
}
