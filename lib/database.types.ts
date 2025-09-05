export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          farcaster_id: string
          display_name: string
          bio: string | null
          interests: string[] | null
          courses: string[] | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farcaster_id: string
          display_name: string
          bio?: string | null
          interests?: string[] | null
          courses?: string[] | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farcaster_id?: string
          display_name?: string
          bio?: string | null
          interests?: string[] | null
          courses?: string[] | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_groups: {
        Row: {
          id: string
          name: string
          description: string
          course: string
          created_by: string
          max_members: number | null
          schedule_link: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          course: string
          created_by: string
          max_members?: number | null
          schedule_link?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          course?: string
          created_by?: string
          max_members?: number | null
          schedule_link?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      study_group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      circles: {
        Row: {
          id: string
          name: string
          description: string
          topic: string
          created_by: string
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          topic: string
          created_by: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          topic?: string
          created_by?: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      circle_members: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      help_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          course: string | null
          subject: string
          urgency: 'low' | 'medium' | 'high'
          status: 'open' | 'in_progress' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          course?: string | null
          subject: string
          urgency?: 'low' | 'medium' | 'high'
          status?: 'open' | 'in_progress' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          course?: string | null
          subject?: string
          urgency?: 'low' | 'medium' | 'high'
          status?: 'open' | 'in_progress' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      help_responses: {
        Row: {
          id: string
          helper_id: string
          request_id: string
          content: string
          is_accepted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          helper_id: string
          request_id: string
          content: string
          is_accepted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          helper_id?: string
          request_id?: string
          content?: string
          is_accepted?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_responses_helper_id_fkey"
            columns: ["helper_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_responses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "help_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          group_id: string
          content: string
          type: 'text' | 'help_request' | 'announcement'
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          group_id: string
          content: string
          type?: 'text' | 'help_request' | 'announcement'
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          group_id?: string
          content?: string
          type?: 'text' | 'help_request' | 'announcement'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      urgency_level: 'low' | 'medium' | 'high'
      help_status: 'open' | 'in_progress' | 'resolved'
      message_type: 'text' | 'help_request' | 'announcement'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
