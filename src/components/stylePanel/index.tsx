import React, { useState } from "react";
import style from "./style.module.scss";
import { Box, Tab, Tabs } from "@mui/material";
import StyleHandler from "./components/styleHandle";
import FontHandler from "./components/fontHandler";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import useToggleElement from "../../hooks/useToggleElement";

function a11yProps(index: number) {
  return {
    id: `stylepanel-tab-${index}`,
    "aria-controls": `stylepanel-tabpanel-${index}`,
  };
}

const StylePanel = () => {
  const [value, setValue] = useState(0);
  const { isHidden, toggleHidden } = useToggleElement();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Paneli açma düğmesi */}
      <div className={style.openStyleBar}>
        <KeyboardDoubleArrowLeftIcon
          onClick={() => toggleHidden(false)}
          sx={{ cursor: "pointer" }}
          aria-label="Stil panelini aç"
          titleAccess="Stil panelini aç"   
        />
      </div>

      <section
        className={`${style.stylePanel} ${isHidden ? style.hidden : ""}`}
        aria-label="Stil ve Yazı Ayarları Paneli"
      >
        <div className={style.wrapper}>
          {/* Paneli kapatma düğmesi */}
          <div onClick={() => toggleHidden()}>
            <KeyboardDoubleArrowRightIcon
              className={style.hide}
              sx={{ cursor: "pointer" }}
              aria-label="Stil panelini kapat"
              titleAccess="Stil panelini kapat"  
            />
          </div>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Stil paneli sekmeleri"
                variant="fullWidth"
              >
                <Tab label="Stil" {...a11yProps(0)} />
                <Tab label="Yazı" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <div
              role="tabpanel"
              hidden={value !== 0}
              id="stylepanel-tabpanel-0"
              aria-labelledby="stylepanel-tab-0"
            >
              {value === 0 && <StyleHandler />}
            </div>

            <div
              role="tabpanel"
              hidden={value !== 1}
              id="stylepanel-tabpanel-1"
              aria-labelledby="stylepanel-tab-1"
            >
              {value === 1 && <FontHandler />}
            </div>
          </Box>
        </div>
      </section>
    </>
  );
};

export default StylePanel;
