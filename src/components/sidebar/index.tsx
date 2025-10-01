import { useState } from "react";
import CustomNodes from "../nodes";
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

// Gösterilecek node tipleri
const NODES = [
  NodeType.DIKDORTGEN,
  NodeType.DAIRE,
  NodeType.YUVARLATILMIS_DIKDORTGEN,
  NodeType.KARE,
  NodeType.ELIPSE,
  NodeType.METIN,
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(1);
  const { isHidden, toggleHidden } = useToggleElement();

  const handleChange = (id: number) => {
    setExpanded(id);
  };

  return (
    <>
      {/* Sağdan açma butonu */}
      <div className={style.openSideNav}>
        <KeyboardDoubleArrowRightIcon onClick={() => toggleHidden(false)} />
      </div>

      <div
        className={`${style.sidebar_wrapper} ${
          isHidden ? style.hidden : ""
        } sidebar`}
      >
        <div className={style.description}>
          <span> Bu düğümleri sağdaki panele sürükleyebilirsiniz. </span>
          <div onClick={() => toggleHidden()}>
            <KeyboardDoubleArrowLeftIcon className={style.hide} />
          </div>
        </div>

        <Accordion expanded={expanded === 1} onChange={() => handleChange(1)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="genel"
            id="genel"
          >
            <Typography>Şekiller</Typography>
          </AccordionSummary>

          <AccordionDetails className={style?.sidebar__nodes}>
            {NODES?.map((node, index) => (
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
      </div>
    </>
  );
};

export default Sidebar;
