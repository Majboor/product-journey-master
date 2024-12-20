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
      analytics: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          location: Json | null
          page_slug: string
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          location?: Json | null
          page_slug: string
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          location?: Json | null
          page_slug?: string
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      button_clicks: {
        Row: {
          button_name: string
          created_at: string
          id: string
          page_slug: string
          session_id: string | null
        }
        Insert: {
          button_name: string
          created_at?: string
          id?: string
          page_slug: string
          session_id?: string | null
        }
        Update: {
          button_name?: string
          created_at?: string
          id?: string
          page_slug?: string
          session_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      jokes: {
        Row: {
          created_at: string
          id: string
          joke_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          joke_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          joke_text?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency_code: string
          customer_email: string | null
          customer_name: string | null
          id: string
          order_id: string
          payment_intent_id: string | null
          payment_status: string
          shipping_status: string
          shipping_updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_id: string
          payment_intent_id?: string | null
          payment_status?: string
          shipping_status?: string
          shipping_updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_id?: string
          payment_intent_id?: string | null
          payment_status?: string
          shipping_status?: string
          shipping_updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          category_id: string | null
          color_scheme: Json | null
          content: Json
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          color_scheme?: Json | null
          content: Json
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          color_scheme?: Json | null
          content?: Json
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name: string
          value?: string
        }
        Relationships: []
      }
      signin_attempts: {
        Row: {
          created_at: string
          id: string
          page_slug: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_slug: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_slug?: string
          session_id?: string | null
        }
        Relationships: []
      }
      swipe_events: {
        Row: {
          additional_data: Json | null
          created_at: string
          direction: string
          event_type: string
          id: string
          page_slug: string
          scroll_position: number | null
          session_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          direction: string
          event_type?: string
          id?: string
          page_slug: string
          scroll_position?: number | null
          session_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          direction?: string
          event_type?: string
          id?: string
          page_slug: string
          scroll_position?: number | null
          session_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      users: {
        Row: {
          id: string | null
          email: string | null
          created_at: string | null
        }
        Insert: {
          id?: string | null
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string | null
          email?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_shipping_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
