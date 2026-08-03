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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      corrections: {
        Row: {
          after_text: string
          before_text: string
          created_at: string
          document_id: string | null
          field_label: string
          id: string
          item_title: string
          kind: string
          rating: string | null
          user_id: string
        }
        Insert: {
          after_text?: string
          before_text?: string
          created_at?: string
          document_id?: string | null
          field_label?: string
          id?: string
          item_title?: string
          kind?: string
          rating?: string | null
          user_id: string
        }
        Update: {
          after_text?: string
          before_text?: string
          created_at?: string
          document_id?: string | null
          field_label?: string
          id?: string
          item_title?: string
          kind?: string
          rating?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "corrections_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          confidence: number
          created_at: string
          doc_date: string
          extracted_text: string
          fields: Json
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          graph_node: string | null
          id: string
          is_demo: boolean
          issuer: string
          skills: Json
          snippet: string
          tags: Json
          timeline_event: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          confidence?: number
          created_at?: string
          doc_date?: string
          extracted_text?: string
          fields?: Json
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          graph_node?: string | null
          id?: string
          is_demo?: boolean
          issuer?: string
          skills?: Json
          snippet?: string
          tags?: Json
          timeline_event?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          confidence?: number
          created_at?: string
          doc_date?: string
          extracted_text?: string
          fields?: Json
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          graph_node?: string | null
          id?: string
          is_demo?: boolean
          issuer?: string
          skills?: Json
          snippet?: string
          tags?: Json
          timeline_event?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string
          created_at: string
          education: Json
          email: string
          full_name: string
          headline: string
          id: string
          location: string
          settings: Json
          skills: Json
          social_links: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string
          created_at?: string
          education?: Json
          email?: string
          full_name?: string
          headline?: string
          id: string
          location?: string
          settings?: Json
          skills?: Json
          social_links?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          created_at?: string
          education?: Json
          email?: string
          full_name?: string
          headline?: string
          id?: string
          location?: string
          settings?: Json
          skills?: Json
          social_links?: Json
          updated_at?: string
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          awards: Json
          bio: string
          completeness: number
          created_at: string
          doc_count: number
          education: Json
          full_name: string
          headline: string
          is_public: boolean
          location: string
          projects: Json
          skills: Json
          slug: string
          timeline: Json
          updated_at: string
          user_id: string
          visible_sections: Json
        }
        Insert: {
          avatar_url?: string | null
          awards?: Json
          bio?: string
          completeness?: number
          created_at?: string
          doc_count?: number
          education?: Json
          full_name?: string
          headline?: string
          is_public?: boolean
          location?: string
          projects?: Json
          skills?: Json
          slug: string
          timeline?: Json
          updated_at?: string
          user_id: string
          visible_sections?: Json
        }
        Update: {
          avatar_url?: string | null
          awards?: Json
          bio?: string
          completeness?: number
          created_at?: string
          doc_count?: number
          education?: Json
          full_name?: string
          headline?: string
          is_public?: boolean
          location?: string
          projects?: Json
          skills?: Json
          slug?: string
          timeline?: Json
          updated_at?: string
          user_id?: string
          visible_sections?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
