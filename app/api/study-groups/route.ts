import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';
import { farcasterHelpers, createStudyGroupAnnouncementText } from '@/lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get('course');
    const search = searchParams.get('search');

    const filters: { course?: string; search?: string } = {};
    if (course) filters.course = course;
    if (search) filters.search = search;

    const studyGroups = await supabaseHelpers.getStudyGroups(filters);

    return NextResponse.json({
      success: true,
      data: studyGroups,
    });
  } catch (error) {
    console.error('Error fetching study groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      course,
      created_by,
      max_members,
      schedule_link,
      announce_on_farcaster = false,
      signer_uuid,
    } = body;

    // Validate required fields
    if (!name || !description || !course || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, course, created_by' },
        { status: 400 }
      );
    }

    // Create study group in database
    const studyGroup = await supabaseHelpers.createStudyGroup({
      name,
      description,
      course,
      created_by,
      max_members,
      schedule_link,
    });

    // Automatically add creator as first member
    await supabaseHelpers.joinStudyGroup(studyGroup.id, created_by);

    // Optionally announce on Farcaster
    let castResult = null;
    if (announce_on_farcaster && signer_uuid) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://educonnect.app';
        const castText = createStudyGroupAnnouncementText(
          name,
          course,
          description,
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
      data: studyGroup,
      cast_result: castResult,
    });
  } catch (error) {
    console.error('Error creating study group:', error);
    return NextResponse.json(
      { error: 'Failed to create study group' },
      { status: 500 }
    );
  }
}
