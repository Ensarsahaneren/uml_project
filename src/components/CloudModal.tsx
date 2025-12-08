import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, // DialogActions eklendi
  TextField, Button, List, ListItem, ListItemText, 
  IconButton, Divider, Typography, Box 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { fetchUserDiagrams, saveDiagramToCloud } from "../utils/cloudStorage";
import type { SavedDiagram } from "../utils/cloudStorage";
import type { Node, Edge } from "@xyflow/react";

type Props = {
  open: boolean;
  onClose: () => void;
  currentNodes: Node[];
  currentEdges: Edge[];
  onLoadDiagram: (nodes: Node[], edges: Edge[]) => void;
};

export default function CloudModal({ open, onClose, currentNodes, currentEdges, onLoadDiagram }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [diagramName, setDiagramName] = useState("Yeni Diyagram");
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [loading, setLoading] = useState(false);

  // YENİ STATE: Silinecek diyagramın ID'sini tutar. Doluysa onay penceresi açılır.
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      if (sess) loadList();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) loadList();
      else setDiagrams([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadList = async () => {
    try {
      const data = await fetchUserDiagrams();
      setDiagrams(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Kayıt hatası: " + error.message);
    else alert("Kayıt başarılı! Lütfen giriş yapın.");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    if (!diagramName) return alert("Lütfen bir isim girin");
    try {
      setLoading(true);
      await saveDiagramToCloud(diagramName, currentNodes, currentEdges);
      alert("Başarıyla kaydedildi!");
      loadList();
    } catch (error: unknown) {
      let msg = "Bilinmeyen hata";
      if (error instanceof Error) msg = error.message;
      else if (typeof error === "string") msg = error;
      alert("Hata: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // 1. ADIM: Çöp kutusuna basınca sadece ID'yi set et, silme işlemini yapma.
  const onClickDeleteIcon = (id: string) => {
    setDeleteConfirmationId(id);
  };

  // 2. ADIM: Onay penceresinde "EVET" denirse burası çalışır.
  const confirmDelete = async () => {
    if (!deleteConfirmationId) return;
    
    const { error } = await supabase.from('diagrams').delete().eq('id', deleteConfirmationId);
    
    if (!error) {
      loadList();
    } else {
      alert("Silme sırasında hata oluştu.");
    }
    // İşlem bitince ID'yi sıfırla (Pencere kapanır)
    setDeleteConfirmationId(null);
  };

  // İptal edilirse
  const cancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  return (
    <>
      {/* Ana Modal */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display:'flex', alignItems:'center', gap: 1 }}>
          ☁️ Bulut Depolama
        </DialogTitle>
        <DialogContent>
          {!session ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Projelerinizi kaydetmek ve her yerden erişmek için giriş yapın.
              </Typography>
              <TextField label="Email" size="small" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
              <TextField label="Şifre" type="password" size="small" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button variant="contained" onClick={handleLogin} disabled={loading} fullWidth>Giriş Yap</Button>
                <Button variant="outlined" onClick={handleSignUp} disabled={loading} fullWidth>Kayıt Ol</Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="caption">Giriş yapıldı: <b>{session.user.email}</b></Typography>
                  <Button size="small" color="error" onClick={handleLogout}>Çıkış</Button>
               </Box>

               <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <TextField 
                      label="Diyagram Adı" 
                      size="small" 
                      value={diagramName} 
                      onChange={e => setDiagramName(e.target.value)} 
                      fullWidth
                  />
                  <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleSave} disabled={loading}>
                      Kaydet
                  </Button>
               </Box>

               <Divider textAlign="left">KAYITLI PROJELERİM</Divider>
               
               <List sx={{ maxHeight: 300, overflow: 'auto', mt: 1 }}>
                  {diagrams.map((d) => (
                      <ListItem 
                          key={d.id}
                          secondaryAction={
                              // Buradaki onClick değişti
                              <IconButton edge="end" aria-label="delete" onClick={() => onClickDeleteIcon(d.id)} size="small">
                                  <DeleteIcon />
                              </IconButton>
                          }
                          sx={{ 
                            border: '1px solid #eee', 
                            mb: 1, 
                            borderRadius: 1,
                            '&:hover': { backgroundColor: '#f9f9f9' }
                          }}
                      >
                          <ListItemText 
                              primary={d.name} 
                              secondary={new Date(d.updated_at).toLocaleString('tr-TR')} 
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                  onLoadDiagram(d.content.nodes, d.content.edges);
                                  onClose();
                              }}
                          />
                      </ListItem>
                  ))}
                  {diagrams.length === 0 && <Typography variant="body2" color="text.secondary" align="center" sx={{mt:2}}>Henüz kayıt yok.</Typography>}
               </List>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* --- YENİ EKLENEN ONAY PENCERESİ --- */}
      <Dialog
        open={!!deleteConfirmationId} // ID varsa pencereyi aç
        onClose={cancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Diyagramı Sil?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Bu diyagramı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}