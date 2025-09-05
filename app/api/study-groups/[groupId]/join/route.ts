import { NextRequest, NextResponse } from 'next/server';
import { studyGroupService } from '@/lib/services/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await request.json();
    const { groupId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const studyGroup = await studyGroupService.joinStudyGroup(groupId, userId);

    return NextResponse.json({
      success: true,
      studyGroup,
      message: 'Successfully joined study group',
    });
  } catch (error: any) {
    console.error('Join study group error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to join study group' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { groupId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const studyGroup = await studyGroupService.leaveStudyGroup(groupId, userId);

    return NextResponse.json({
      success: true,
      studyGroup,
      message: 'Successfully left study group',
    });
  } catch (error: any) {
    console.error('Leave study group error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to leave study group' },
      { status: 500 }
    );
  }
}
