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

const Sidebar = () => {
  const [expanded, setExpanded] = useState(1);
  const { isHidden, toggleHidden } = useToggleElement();

  const handleChange = (id: number) => setExpanded(id);

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
        <Accordion expanded={expanded === 1} onChange={() => handleChange(1)}>
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
        <Accordion
          expanded={expanded === 2}
          onChange={(_, isExpanded) => setExpanded(isExpanded ? 2 : 0)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="class-diagram"
            id="class-diagram"
          >
            <Typography>Sınıf Diyagramı</Typography>
          </AccordionSummary>

          <AccordionDetails className={style?.sidebar__nodes}>
            <CustomNodes key="sinif"        data={{ type: NodeType.SINIF }}        draggable inSidebar initialValue="Sınıf" />
            <CustomNodes key="soyut_sinif"  data={{ type: NodeType.SOYUT_SINIF }}  draggable inSidebar initialValue="AbstractClass" />
            <CustomNodes key="arayuz"       data={{ type: NodeType.ARAYUZ }}       draggable inSidebar initialValue="Name" />
            <CustomNodes key="nesne"        data={{ type: NodeType.NESNE }}        draggable inSidebar initialValue="Object" />
          </AccordionDetails>
        </Accordion>

        {/* 3) Sıralama (Sequence) Diyagramı */}
        <Accordion
          expanded={expanded === 3}
          onChange={(_, isExpanded) => setExpanded(isExpanded ? 3 : 0)}
        >
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
      </div>
    </>
  );
};

export default Sidebar;
