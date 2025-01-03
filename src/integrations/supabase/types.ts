export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          additional_data: Json | null
          button_name: string
          created_at: string
          id: string
          page_slug: string
          session_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          button_name: string
          created_at?: string
          id?: string
          page_slug: string
          session_id?: string | null
        }
        Update: {
          additional_data?: Json | null
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
      currencies: {
        Row: {
          code: string
          created_at: string
          is_active: boolean | null
          name: string
          symbol: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean | null
          name: string
          symbol: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean | null
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      domain_mappings: {
        Row: {
          category_id: string | null
          created_at: string
          domain: string
          id: string
          is_main: boolean | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          domain: string
          id?: string
          is_main?: boolean | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          domain?: string
          id?: string
          is_main?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
          template_type: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          color_scheme?: Json | null
          content: Json
          created_at?: string
          id?: string
          slug: string
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          color_scheme?: Json | null
          content?: Json
          created_at?: string
          id?: string
          slug?: string
          template_type?: string | null
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
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          name: string
          slug: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name: string
          slug: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name?: string
          slug?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          name: string
          page_id: string | null
          price: number
          product_category_id: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name: string
          page_id?: string | null
          price: number
          product_category_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name?: string
          page_id?: string | null
          price?: number
          product_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_product_category_id_fkey"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
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
          name?: string
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
      sitemaps: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          last_generated: string | null
          last_updated: string | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          last_generated?: string | null
          last_updated?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          last_generated?: string | null
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sitemaps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
          page_slug?: string
          scroll_position?: number | null
          session_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
