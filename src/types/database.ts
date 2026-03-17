export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string | null
          created_at: string
          customer_id: string
          date: string
          duration: number
          id: string
          listing_id: string
          price: number
          provider_id: string
          status: Database["public"]["Enums"]["booking_status"]
          time: string
          title: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_id: string
          date: string
          duration: number
          id?: string
          listing_id: string
          price: number
          provider_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          time: string
          title: string
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_id?: string
          date?: string
          duration?: number
          id?: string
          listing_id?: string
          price?: number
          provider_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          icon: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          booking_id: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          issue: string
          listing_title: string
          priority: Database["public"]["Enums"]["dispute_priority"]
          provider_id: string
          resolution: string | null
          status: Database["public"]["Enums"]["dispute_status"]
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          customer_id: string
          description?: string
          id?: string
          issue: string
          listing_title: string
          priority?: Database["public"]["Enums"]["dispute_priority"]
          provider_id: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          issue?: string
          listing_title?: string
          priority?: Database["public"]["Enums"]["dispute_priority"]
          provider_id?: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
        }
        Relationships: [
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          listing_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          listing_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          amenities: string[]
          category_slug: string
          created_at: string
          description: string
          duration: number
          featured: boolean
          id: string
          images: string[]
          next_available: string | null
          price: number
          provider_id: string
          rating: number
          review_count: number
          status: Database["public"]["Enums"]["listing_status"]
          title: string
        }
        Insert: {
          amenities?: string[]
          category_slug: string
          created_at?: string
          description?: string
          duration: number
          featured?: boolean
          id?: string
          images?: string[]
          next_available?: string | null
          price: number
          provider_id: string
          rating?: number
          review_count?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
        }
        Update: {
          amenities?: string[]
          category_slug?: string
          created_at?: string
          description?: string
          duration?: number
          featured?: boolean
          id?: string
          images?: string[]
          next_available?: string | null
          price?: number
          provider_id?: string
          rating?: number
          review_count?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      providers: {
        Row: {
          availability: Json | null
          categories: string[]
          created_at: string
          id: string
          joined_date: string
          rating: number
          review_count: number
          social_links: Json | null
          verified: boolean
          zip_codes: string[]
        }
        Insert: {
          availability?: Json | null
          categories?: string[]
          created_at?: string
          id: string
          joined_date?: string
          rating?: number
          review_count?: number
          social_links?: Json | null
          verified?: boolean
          zip_codes?: string[]
        }
        Update: {
          availability?: Json | null
          categories?: string[]
          created_at?: string
          id?: string
          joined_date?: string
          rating?: number
          review_count?: number
          social_links?: Json | null
          verified?: boolean
          zip_codes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "providers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          customer_id: string
          customer_name: string
          id: string
          listing_id: string
          provider_id: string
          rating: number
          reply: string | null
          text: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          customer_name: string
          id?: string
          listing_id: string
          provider_id: string
          rating: number
          reply?: string | null
          text?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          customer_name?: string
          id?: string
          listing_id?: string
          provider_id?: string
          rating?: number
          reply?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          rating: number
          service: string
          text: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          rating: number
          service: string
          text: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          rating?: number
          service?: string
          text?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      dispute_priority: "low" | "medium" | "high"
      dispute_status: "open" | "in-progress" | "resolved" | "closed"
      listing_status: "active" | "draft" | "suspended" | "archived"
      user_role: "customer" | "provider" | "admin"
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
