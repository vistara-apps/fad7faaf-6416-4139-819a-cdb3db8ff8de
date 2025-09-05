import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { user_id } = body;
    const groupId = params.id;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Join the study group
    const membership = await supabaseHelpers.joinStudyGroup(groupId, user_id);

    return NextResponse.json({
      success: true,
      data: membership,
      message: 'Successfully joined study group',
    });
  } catch (error: any) {
    console.error('Error joining study group:', error);
    
    // Handle duplicate membership error
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You are already a member of this study group' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to join study group' },
      { status: 500 }
    );
  }
}
