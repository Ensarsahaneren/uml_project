import { useState } from "react";
import type { MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { EventHandler } from "../../utils/home";

type MenuKey = "dosya" | "duzenle" | "goruntule" | "ekstralar" | "yardim";

const TopBar = () => {
  const [anchor, setAnchor] = useState<Record<MenuKey, HTMLElement | null>>({
    dosya: null, duzenle: null, goruntule: null, ekstralar: null, yardim: null
  });

  const openMenu = (k: MenuKey) => (e: MouseEvent<HTMLElement>) =>
    setAnchor((s) => ({ ...s, [k]: e.currentTarget }));
  const closeMenu = (k: MenuKey) => () =>
    setAnchor((s) => ({ ...s, [k]: null }));

  const act = (event: string, payload?: unknown) => () =>
    EventHandler.emit(event, payload);

  return (
    <AppBar
      position="sticky" color="default" elevation={0}
      sx={{
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderBottom: "1px solid rgba(0,0,0,.08)",
        backgroundColor: "#fff", color: "#111",
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 44, py: 0, gap: 1 }}>
        <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 700 }}>
          UML Çizdirme
        </Typography>

        <Button size="small" onClick={openMenu("dosya")}>DOSYA</Button>
        <Menu anchorEl={anchor.dosya} open={!!anchor.dosya} onClose={closeMenu("dosya")}>
          <MenuItem onClick={act("menu:new-diagram")}>Yeni</MenuItem>
          <Divider />
          <MenuItem onClick={act("menu:save-json")}>Kaydet (JSON)</MenuItem>
          <MenuItem onClick={act("menu:load-json")}>Aç (JSON)</MenuItem>
          <Divider />
          <MenuItem onClick={act("menu:export-png")}>PNG olarak dışa aktar</MenuItem>
          <MenuItem onClick={() => window.print()}>Yazdır</MenuItem>
        </Menu>

        <Button size="small" onClick={openMenu("duzenle")}>DÜZENLE</Button>
        <Menu anchorEl={anchor.duzenle} open={!!anchor.duzenle} onClose={closeMenu("duzenle")}>
          <MenuItem onClick={act("menu:undo")}>Geri Al</MenuItem>
          <MenuItem onClick={act("menu:redo")}>Yinele</MenuItem>
          <Divider />
          <MenuItem onClick={act("menu:delete-selection")}>Seçileni Sil</MenuItem>
        </Menu>

        <Button size="small" onClick={openMenu("goruntule")}>GÖRÜNTÜLE</Button>
        <Menu anchorEl={anchor.goruntule} open={!!anchor.goruntule} onClose={closeMenu("goruntule")}>
          <MenuItem onClick={act("menu:fit-view")}>Tümünü Kadraja Al</MenuItem>
          <MenuItem onClick={act("menu:center")}>Ortala</MenuItem>
          <Divider />
          <MenuItem onClick={act("menu:toggle-grid")}>Izgarayı Aç/Kapat</MenuItem>
        </Menu>

        <Button size="small" onClick={openMenu("ekstralar")}>EKSTRALAR</Button>
        <Menu anchorEl={anchor.ekstralar} open={!!anchor.ekstralar} onClose={closeMenu("ekstralar")}>
          <MenuItem onClick={act("menu:sample-class")}>Örnek Sınıf Diyagramı Ekle</MenuItem>
        </Menu>

        <Button size="small" onClick={openMenu("yardim")}>YARDIM</Button>
        <Menu anchorEl={anchor.yardim} open={!!anchor.yardim} onClose={closeMenu("yardim")}>
          <MenuItem onClick={() => window.open("https://uml-diagrams.org/", "_blank")}>UML Referansı</MenuItem>
          <MenuItem onClick={() => alert("Kısayollar: Ctrl+S kaydet, Del sil…")}>Kısayollar</MenuItem>
          <MenuItem onClick={() => alert("v1.0.0")}>Hakkında</MenuItem>
        </Menu>

        <Box sx={{ flex: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
