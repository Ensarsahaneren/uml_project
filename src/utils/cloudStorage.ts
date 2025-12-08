import { supabase } from "../supabaseClient";
import type { Node, Edge } from "@xyflow/react";

export type SavedDiagram = {
  id: string;
  name: string;
  content: { nodes: Node[]; edges: Edge[] };
  updated_at: string;
};

// Kaydetme Fonksiyonu
export const saveDiagramToCloud = async (name: string, nodes: Node[], edges: Edge[], id?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Lütfen önce giriş yapın.");

  const content = { nodes, edges };

  // ID varsa güncelle, yoksa yeni oluştur
  const { data, error } = await supabase
    .from('diagrams')
    .upsert({
      id: id, 
      user_id: user.id,
      name,
      content,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Listeleme Fonksiyonu
export const fetchUserDiagrams = async () => {
  const { data, error } = await supabase
    .from('diagrams')
    .select('id, name, content, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as SavedDiagram[];
};