Connecting to db 5432
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          confidence: number | null
          consultation_id: string
          generated_at: string
          herbs: Json | null
          id: string
          model: string | null
          notes: string | null
          prompt_snapshot: string | null
          raw_response: string | null
          usage: string | null
        }
        Insert: {
          confidence?: number | null
          consultation_id: string
          generated_at?: string
          herbs?: Json | null
          id?: string
          model?: string | null
          notes?: string | null
          prompt_snapshot?: string | null
          raw_response?: string | null
          usage?: string | null
        }
        Update: {
          confidence?: number | null
          consultation_id?: string
          generated_at?: string
          herbs?: Json | null
          id?: string
          model?: string | null
          notes?: string | null
          prompt_snapshot?: string | null
          raw_response?: string | null
          usage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: true
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_contraindications: {
        Row: {
          consultation_id: string
          contraindication_id: string
        }
        Insert: {
          consultation_id: string
          contraindication_id: string
        }
        Update: {
          consultation_id?: string
          contraindication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_contraindications_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_contraindications_contraindication_id_fkey"
            columns: ["contraindication_id"]
            isOneToOne: false
            referencedRelation: "contraindications"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      contraindications: {
        Row: {
          category: string | null
          code: string
          id: string
          name: string
          pinyin: string | null
          pinyin_initial: string | null
        }
        Insert: {
          category?: string | null
          code: string
          id?: string
          name: string
          pinyin?: string | null
          pinyin_initial?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          id?: string
          name?: string
          pinyin?: string | null
          pinyin_initial?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number
          created_at: string
          gender: string
          id: string
          id_number: string | null
          insurance_card_no: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["patient_status"]
          updated_at: string
        }
        Insert: {
          age: number
          created_at?: string
          gender: string
          id?: string
          id_number?: string | null
          insurance_card_no?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          updated_at?: string
        }
        Update: {
          age?: number
          created_at?: string
          gender?: string
          id?: string
          id_number?: string | null
          insurance_card_no?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          updated_at?: string
        }
        Relationships: []
      }
      prescription_steps: {
        Row: {
          completed_at: string | null
          id: string
          prescription_id: string
          project_id: string
          region: string
          sort_order: number
          started_at: string | null
          status: Database["public"]["Enums"]["prescription_step_status"]
          treatment_record_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          prescription_id: string
          project_id: string
          region: string
          sort_order?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["prescription_step_status"]
          treatment_record_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          prescription_id?: string
          project_id?: string
          region?: string
          sort_order?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["prescription_step_status"]
          treatment_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_steps_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "therapy_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_steps_treatment_record_id_fkey"
            columns: ["treatment_record_id"]
            isOneToOne: false
            referencedRelation: "treatment_records"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          consultation_id: string
          created_at: string
          herbs: Json | null
          id: string
          meta: Json | null
          total_amount: number | null
        }
        Insert: {
          consultation_id: string
          created_at?: string
          herbs?: Json | null
          id?: string
          meta?: Json | null
          total_amount?: number | null
        }
        Update: {
          consultation_id?: string
          created_at?: string
          herbs?: Json | null
          id?: string
          meta?: Json | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: true
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_items: {
        Row: {
          consultation_id: string
          enqueued_at: string
          id: string
          patient_id: string
          queue_number: number
          queue_type: Database["public"]["Enums"]["queue_type"]
          region: string | null
          status: Database["public"]["Enums"]["queue_status"]
        }
        Insert: {
          consultation_id: string
          enqueued_at?: string
          id?: string
          patient_id: string
          queue_number: number
          queue_type: Database["public"]["Enums"]["queue_type"]
          region?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
        }
        Update: {
          consultation_id?: string
          enqueued_at?: string
          id?: string
          patient_id?: string
          queue_number?: number
          queue_type?: Database["public"]["Enums"]["queue_type"]
          region?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
        }
        Relationships: [
          {
            foreignKeyName: "queue_items_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_items_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      scale_questions: {
        Row: {
          id: string
          options: Json | null
          required: boolean
          slider_config: Json | null
          sort_order: number
          template_id: string
          text: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          id?: string
          options?: Json | null
          required?: boolean
          slider_config?: Json | null
          sort_order?: number
          template_id: string
          text: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          id?: string
          options?: Json | null
          required?: boolean
          slider_config?: Json | null
          sort_order?: number
          template_id?: string
          text?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "scale_questions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "scale_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scale_results: {
        Row: {
          answers: Json
          consultation_id: string
          id: string
          stage: Database["public"]["Enums"]["scale_stage"]
          submitted_at: string
          template_id: string
          total_score: number | null
        }
        Insert: {
          answers?: Json
          consultation_id: string
          id?: string
          stage: Database["public"]["Enums"]["scale_stage"]
          submitted_at?: string
          template_id: string
          total_score?: number | null
        }
        Update: {
          answers?: Json
          consultation_id?: string
          id?: string
          stage?: Database["public"]["Enums"]["scale_stage"]
          submitted_at?: string
          template_id?: string
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scale_results_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scale_results_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "scale_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scale_templates: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      system_config: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      therapy_projects: {
        Row: {
          bpm: number | null
          contraindications: Json | null
          energy_level: string | null
          guidance_script: string | null
          has_guidance: boolean
          has_scenario: boolean
          id: string
          is_internal: boolean
          mechanism: string | null
          mood: string | null
          name: string
          notes: string | null
          region: string | null
          target_audience: string | null
        }
        Insert: {
          bpm?: number | null
          contraindications?: Json | null
          energy_level?: string | null
          guidance_script?: string | null
          has_guidance?: boolean
          has_scenario?: boolean
          id?: string
          is_internal?: boolean
          mechanism?: string | null
          mood?: string | null
          name: string
          notes?: string | null
          region?: string | null
          target_audience?: string | null
        }
        Update: {
          bpm?: number | null
          contraindications?: Json | null
          energy_level?: string | null
          guidance_script?: string | null
          has_guidance?: boolean
          has_scenario?: boolean
          id?: string
          is_internal?: boolean
          mechanism?: string | null
          mood?: string | null
          name?: string
          notes?: string | null
          region?: string | null
          target_audience?: string | null
        }
        Relationships: []
      }
      treatment_records: {
        Row: {
          consultation_id: string
          created_at: string
          duration: number | null
          end_time: string | null
          id: string
          region: string | null
          start_time: string | null
        }
        Insert: {
          consultation_id: string
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          region?: string | null
          start_time?: string | null
        }
        Update: {
          consultation_id?: string
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          region?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_records_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          consultation_id: string
          diastolic_bp: number
          heart_rate: number
          id: string
          recorded_at: string
          recorded_by: string | null
          stage: Database["public"]["Enums"]["vital_stage"]
          systolic_bp: number
        }
        Insert: {
          consultation_id: string
          diastolic_bp: number
          heart_rate: number
          id?: string
          recorded_at?: string
          recorded_by?: string | null
          stage: Database["public"]["Enums"]["vital_stage"]
          systolic_bp: number
        }
        Update: {
          consultation_id?: string
          diastolic_bp?: number
          heart_rate?: number
          id?: string
          recorded_at?: string
          recorded_by?: string | null
          stage?: Database["public"]["Enums"]["vital_stage"]
          systolic_bp?: number
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
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
      patient_status:
        | "checked-in"
        | "waiting"
        | "consulting"
        | "pending-treatment"
        | "treating"
        | "completed"
      prescription_step_status:
        | "pending"
        | "in-progress"
        | "completed"
        | "skipped"
      question_type: "single-choice" | "multi-choice" | "slider" | "text"
      queue_status: "waiting" | "in-progress" | "completed"
      queue_type: "waiting" | "treatment"
      scale_stage: "pre" | "post"
      vital_stage: "pre-treatment" | "post-treatment"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      patient_status: [
        "checked-in",
        "waiting",
        "consulting",
        "pending-treatment",
        "treating",
        "completed",
      ],
      prescription_step_status: [
        "pending",
        "in-progress",
        "completed",
        "skipped",
      ],
      question_type: ["single-choice", "multi-choice", "slider", "text"],
      queue_status: ["waiting", "in-progress", "completed"],
      queue_type: ["waiting", "treatment"],
      scale_stage: ["pre", "post"],
      vital_stage: ["pre-treatment", "post-treatment"],
    },
  },
} as const

