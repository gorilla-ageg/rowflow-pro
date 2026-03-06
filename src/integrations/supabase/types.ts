export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      athlete_profiles: {
        Row: {
          boat_class: string | null
          classes_per_day: number | null
          created_at: string
          exam_weeks: Json | null
          hard_days: string[] | null
          height: number | null
          id: string
          injuries: string | null
          seat_position: string | null
          sleep_goal: number | null
          updated_at: string
          user_id: string
          weight: number | null
          year: string | null
        }
        Insert: {
          boat_class?: string | null
          classes_per_day?: number | null
          created_at?: string
          exam_weeks?: Json | null
          hard_days?: string[] | null
          height?: number | null
          id?: string
          injuries?: string | null
          seat_position?: string | null
          sleep_goal?: number | null
          updated_at?: string
          user_id: string
          weight?: number | null
          year?: string | null
        }
        Update: {
          boat_class?: string | null
          classes_per_day?: number | null
          created_at?: string
          exam_weeks?: Json | null
          hard_days?: string[] | null
          height?: number | null
          id?: string
          injuries?: string | null
          seat_position?: string | null
          sleep_goal?: number | null
          updated_at?: string
          user_id?: string
          weight?: number | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_profiles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      evening_checkins: {
        Row: {
          athlete_id: string
          created_at: string
          date: string
          day_rating: number | null
          energy_final: number | null
          expected_sleep: number | null
          hydration: string | null
          id: string
          nutrition: string | null
        }
        Insert: {
          athlete_id: string
          created_at?: string
          date?: string
          day_rating?: number | null
          energy_final?: number | null
          expected_sleep?: number | null
          hydration?: string | null
          id?: string
          nutrition?: string | null
        }
        Update: {
          athlete_id?: string
          created_at?: string
          date?: string
          day_rating?: number | null
          energy_final?: number | null
          expected_sleep?: number | null
          hydration?: string | null
          id?: string
          nutrition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evening_checkins_athlete_id_profiles_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      injuries: {
        Row: {
          athlete_id: string
          body_part: string
          created_at: string
          date_flagged: string
          description: string | null
          id: string
          resolved: boolean | null
          severity: string | null
        }
        Insert: {
          athlete_id: string
          body_part: string
          created_at?: string
          date_flagged?: string
          description?: string | null
          id?: string
          resolved?: boolean | null
          severity?: string | null
        }
        Update: {
          athlete_id?: string
          body_part?: string
          created_at?: string
          date_flagged?: string
          description?: string | null
          id?: string
          resolved?: boolean | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "injuries_athlete_id_profiles_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_urgent: boolean | null
          read: boolean | null
          receiver_id: string
          sender_id: string
          team_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
          team_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      morning_checkins: {
        Row: {
          assignment_due: boolean | null
          athlete_id: string
          classes_today: number | null
          created_at: string
          date: string
          energy: number | null
          exam_this_week: boolean | null
          has_pain: boolean | null
          id: string
          motivation: number | null
          note_to_coach: string | null
          pain_level: number | null
          pain_location: string | null
          sleep_hours: number | null
          sleep_quality: number | null
          stress: number | null
        }
        Insert: {
          assignment_due?: boolean | null
          athlete_id: string
          classes_today?: number | null
          created_at?: string
          date?: string
          energy?: number | null
          exam_this_week?: boolean | null
          has_pain?: boolean | null
          id?: string
          motivation?: number | null
          note_to_coach?: string | null
          pain_level?: number | null
          pain_location?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress?: number | null
        }
        Update: {
          assignment_due?: boolean | null
          athlete_id?: string
          classes_today?: number | null
          created_at?: string
          date?: string
          energy?: number | null
          exam_this_week?: boolean | null
          has_pain?: boolean | null
          id?: string
          motivation?: number | null
          note_to_coach?: string | null
          pain_level?: number | null
          pain_location?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "morning_checkins_athlete_id_profiles_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_session_checkins: {
        Row: {
          academic_stress: number | null
          athlete_id: string
          back_fatigue: number | null
          breathing: number | null
          completion_status: string | null
          created_at: string
          date: string
          dnf_reason: string | null
          felt_good: string | null
          felt_off: string | null
          has_pain: boolean | null
          hit_targets: string | null
          id: string
          legs_fatigue: number | null
          message_to_coach: string | null
          pain_level: number | null
          pain_location: string | null
          ready_tomorrow: string | null
          recovery_status: number | null
          rpe: number | null
          session_id: string | null
          study_hours: number | null
          studying_tonight: boolean | null
        }
        Insert: {
          academic_stress?: number | null
          athlete_id: string
          back_fatigue?: number | null
          breathing?: number | null
          completion_status?: string | null
          created_at?: string
          date?: string
          dnf_reason?: string | null
          felt_good?: string | null
          felt_off?: string | null
          has_pain?: boolean | null
          hit_targets?: string | null
          id?: string
          legs_fatigue?: number | null
          message_to_coach?: string | null
          pain_level?: number | null
          pain_location?: string | null
          ready_tomorrow?: string | null
          recovery_status?: number | null
          rpe?: number | null
          session_id?: string | null
          study_hours?: number | null
          studying_tonight?: boolean | null
        }
        Update: {
          academic_stress?: number | null
          athlete_id?: string
          back_fatigue?: number | null
          breathing?: number | null
          completion_status?: string | null
          created_at?: string
          date?: string
          dnf_reason?: string | null
          felt_good?: string | null
          felt_off?: string | null
          has_pain?: boolean | null
          hit_targets?: string | null
          id?: string
          legs_fatigue?: number | null
          message_to_coach?: string | null
          pain_level?: number | null
          pain_location?: string | null
          ready_tomorrow?: string | null
          recovery_status?: number | null
          rpe?: number | null
          session_id?: string | null
          study_hours?: number | null
          studying_tonight?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "post_session_checkins_athlete_id_profiles_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_session_checkins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          assigned_to: string | null
          coach_id: string | null
          cooldown: string | null
          created_at: string
          date: string
          duration: number | null
          id: string
          intensity: string | null
          main_set: string | null
          notes: string | null
          notes_visible: boolean | null
          target_hr_zone: string | null
          target_rate: string | null
          target_split: string | null
          team_id: string
          time: string | null
          type: string
          warmup: string | null
        }
        Insert: {
          assigned_to?: string | null
          coach_id?: string | null
          cooldown?: string | null
          created_at?: string
          date: string
          duration?: number | null
          id?: string
          intensity?: string | null
          main_set?: string | null
          notes?: string | null
          notes_visible?: boolean | null
          target_hr_zone?: string | null
          target_rate?: string | null
          target_split?: string | null
          team_id: string
          time?: string | null
          type: string
          warmup?: string | null
        }
        Update: {
          assigned_to?: string | null
          coach_id?: string | null
          cooldown?: string | null
          created_at?: string
          date?: string
          duration?: number | null
          id?: string
          intensity?: string | null
          main_set?: string | null
          notes?: string | null
          notes_visible?: boolean | null
          target_hr_zone?: string | null
          target_rate?: string | null
          target_split?: string | null
          team_id?: string
          time?: string | null
          type?: string
          warmup?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          coach_id: string | null
          created_at: string
          division: string | null
          id: string
          invite_code: string
          name: string
          season_end: string | null
          season_start: string | null
        }
        Insert: {
          coach_id?: string | null
          created_at?: string
          division?: string | null
          id?: string
          invite_code?: string
          name: string
          season_end?: string | null
          season_start?: string | null
        }
        Update: {
          coach_id?: string | null
          created_at?: string
          division?: string | null
          id?: string
          invite_code?: string
          name?: string
          season_end?: string | null
          season_start?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "coach" | "athlete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["coach", "athlete"],
    },
  },
} as const
