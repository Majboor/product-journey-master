import { supabase } from "@/integrations/supabase/client";

export const createCategory = async (name: string, slug: string) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          slug,
          description: `This is a sample category for ${name}`
        }
      ])
      .select();

    if (error) throw error;
    
    console.log("Category created successfully:", data);
    return data[0];
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};