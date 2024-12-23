import { supabase } from "@/integrations/supabase/client";

export const getDomainMapping = async (categoryId?: string) => {
  if (categoryId) {
    const { data, error } = await supabase
      .from('domain_mappings')
      .select()
      .eq('category_id', categoryId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('domain_mappings')
      .select()
      .eq('is_main', true)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

export const updateDomainMapping = async ({ 
  categoryId, 
  domain, 
  isMain = false 
}: { 
  categoryId?: string, 
  domain: string, 
  isMain?: boolean 
}) => {
  const existingMapping = await getDomainMapping(categoryId);

  if (existingMapping) {
    const { error } = await supabase
      .from('domain_mappings')
      .update({ domain, is_main: isMain })
      .eq('id', existingMapping.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('domain_mappings')
      .insert({ 
        category_id: categoryId, 
        domain, 
        is_main: isMain 
      });

    if (error) throw error;
  }
};