import { useState } from "react";
import style from "./style.module.scss";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NodeType } from "../../utils/home";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import useToggleElement from "../../hooks/useToggleElement";
import CustomNodes from "../nodes";

/** Şekiller (temel şekiller) */
const BASIC_NODES = [
  NodeType.DIKDORTGEN,
  NodeType.DAIRE,
  NodeType.YUVARLATILMIS_DIKDORTGEN,
  NodeType.KARE,
  NodeType.ELIPSE,
  NodeType.METIN,
] as const;

// Sidebar elemanlarını saran yardımcı bileşen (Label eklemek için)
const SidebarItem = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
    {children}
    <span style={{ fontSize: "0.7rem", color: "#555" }}>{label}</span>
  </div>
);

const Sidebar = () => {
  // Varsayılan olarak ilk menü (Şekiller) açık gelsin
  const [expanded, setExpanded] = useState<number | false>(1);
  const { isHidden, toggleHidden } = useToggleElement();

  // Akordeon açma/kapama mantığı
  const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {/* Sağdan açma butonu */}
      <div className={style.openSideNav}>
        <KeyboardDoubleArrowRightIcon onClick={() => toggleHidden(false)} />
      </div>

      <div className={`${style.sidebar_wrapper} ${isHidden ? style.hidden : ""} sidebar`}>
        <div className={style.description}>
          <span> Bu düğümleri sağdaki panele sürükleyebilirsiniz. </span>
          <div onClick={() => toggleHidden()}>
            <KeyboardDoubleArrowLeftIcon className={style.hide} />
          </div>
        </div>

        {/* 1) Şekiller */}
        <Accordion expanded={expanded === 1} onChange={handleChange(1)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="genel" id="genel">
            <Typography>Şekiller</Typography>
          </AccordionSummary>
          <AccordionDetails className={style?.sidebar__nodes}>
            {BASIC_NODES.map((node, index) => (
              <CustomNodes
                key={index}
                data={{ type: node }}
                draggable
                inSidebar
                initialValue={node === NodeType.METIN ? "Metin" : ""}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* 2) Sınıf Diyagramı */}
        <Accordion expanded={expanded === 2} onChange={handleChange(2)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="class-diagram"
            id="class-diagram"
          >
            <Typography>Sınıf Diyagramı</Typography>
          </AccordionSummary>

          <AccordionDetails className={style?.sidebar__nodes}>
            <CustomNodes key="sinif"        data={{ type: NodeType.SINIF }}        draggable inSidebar initialValue="Sınıf" />
            <CustomNodes key="soyut_sinif"  data={{ type: NodeType.SOYUT_SINIF }}  draggable inSidebar initialValue="Soyut Sınıf" />
            <CustomNodes key="arayuz"       data={{ type: NodeType.ARAYUZ }}       draggable inSidebar initialValue="Arayüz" />
            <CustomNodes key="nesne"        data={{ type: NodeType.NESNE }}        draggable inSidebar initialValue="Nesne" />
          </AccordionDetails>
        </Accordion>

        {/* 3) Sıralama (Sequence) Diyagramı */}
        <Accordion expanded={expanded === 3} onChange={handleChange(3)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sequence-diagram"
            id="sequence-diagram"
          >
            <Typography>Sıralama Diyagramı</Typography>
          </AccordionSummary>

          <AccordionDetails className={style?.sidebar__nodes}>
            <CustomNodes key="aktor"       data={{ type: NodeType.AKTOR }}       draggable inSidebar initialValue="Aktör" />
            <CustomNodes key="lifeline"    data={{ type: NodeType.LIFELINE }}    draggable inSidebar initialValue="Nesne" />
            <CustomNodes key="aktivasyon"  data={{ type: NodeType.AKTIVASYON }}  draggable inSidebar initialValue="" />
            <CustomNodes key="note"        data={{ type: NodeType.NOTE }}        draggable inSidebar initialValue="Not" />
            <CustomNodes key="fragment"    data={{ type: NodeType.FRAGMENT }}    draggable inSidebar initialValue="loop" />
          </AccordionDetails>
        </Accordion>

        {/* 4) Aktivite Diyagramı */}
        <Accordion expanded={expanded === 4} onChange={handleChange(4)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="activity-diagram"
            id="activity-diagram"
          >
            <Typography>Aktivite Diyagramı</Typography>
          </AccordionSummary>

          <AccordionDetails className={style?.sidebar__nodes}>
            
            <SidebarItem label="Başlangıç">
              <CustomNodes key="act_start" data={{ type: NodeType.AKTIVITE_BASLAT }} draggable inSidebar />
            </SidebarItem>

            <SidebarItem label="İşlem">
              <CustomNodes key="act_action" data={{ type: NodeType.AKTIVITE_ISLEM }} draggable inSidebar initialValue="İşlem" />
            </SidebarItem>

            <SidebarItem label="Karar">
              <CustomNodes key="act_decision" data={{ type: NodeType.AKTIVITE_KARAR }} draggable inSidebar />
            </SidebarItem>

            <SidebarItem label="Çatal">
              <CustomNodes key="act_fork" data={{ type: NodeType.AKTIVITE_CATAL }} draggable inSidebar />
            </SidebarItem>

            <SidebarItem label="Bitiş">
              <CustomNodes key="act_end" data={{ type: NodeType.AKTIVITE_BITIS }} draggable inSidebar />
            </SidebarItem>

          </AccordionDetails>
        </Accordion>

      </div>
    </>
  );
};

export default Sidebar;