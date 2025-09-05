import { NextRequest, NextResponse } from 'next/server';
import { studyGroupService } from '@/lib/services/supabase';
import { neynarService } from '@/lib/services/neynar';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const course = searchParams.get('course');
    const search = searchParams.get('search');

    let studyGroups;

    if (search) {
      studyGroups = await studyGroupService.searchStudyGroups(search, course || undefined);
    } else {
      studyGroups = await studyGroupService.getStudyGroups(userId || undefined, course || undefined);
    }

    return NextResponse.json({
      success: true,
      studyGroups,
    });
  } catch (error) {
    console.error('Get study groups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      course,
      createdBy,
      maxMembers,
      scheduleLink,
      announceOnFarcaster,
      signerUuid,
    } = await request.json();

    if (!name || !description || !course || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create study group
    const studyGroup = await studyGroupService.createStudyGroup({
      groupId: uuidv4(),
      name,
      description,
      course,
      members: [createdBy],
      scheduleLink,
      createdBy,
      maxMembers: maxMembers || 20,
      isActive: true,
    });

    // Announce on Farcaster if requested
    if (announceOnFarcaster && signerUuid) {
      try {
        await neynarService.postStudyGroupAnnouncement(
          signerUuid,
          name,
          course,
          description
        );
      } catch (error) {
        console.error('Failed to announce on Farcaster:', error);
        // Don't fail the entire request if Farcaster posting fails
      }
    }

    return NextResponse.json({
      success: true,
      studyGroup,
    });
  } catch (error) {
    console.error('Create study group error:', error);
    return NextResponse.json(
      { error: 'Failed to create study group' },
      { status: 500 }
    );
  }
}
