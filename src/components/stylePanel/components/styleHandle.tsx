import style from "../style.module.scss";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../store";
import { EventHandler, debounce } from "../../../utils/home";

const handleDebounce = debounce((value: string) => {
  EventHandler.emit("update-style", {
    background: value,
  });
}, 300);

const StyleHandler = () => {
  const [checked, setChecked] = useState(true);
  const [fillColor, setFillColor] = useState("#cccccc"); // daha görünür varsayılan
  const { dispatch, state } = useContext(Context);

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setFillColor(newColor);

    if (checked) {
      dispatch({
        type: "addStyle",
        payload: { background: newColor },
      });
      handleDebounce(newColor);
    }
  };

  useEffect(() => {
    const currentColor =
      state?.nodes?.[state?.selectedNodeId]?.style?.background ?? "#cccccc";

    setFillColor(currentColor as string);
  }, [state?.selectedNodeId]);

  return (
    <div className={style.styleHandler}>
      <FormGroup sx={{ marginTop: "20px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label="Dolguyu Kullan" // Türkçeleştirme
          />
          <input
            type="color"
            value={fillColor}
            onChange={handleFillChange}
            disabled={!checked}
            aria-label="Düğüm Dolgu Rengi Seç"
            title="Düğüm Dolgu Rengi Seç"
          />
        </Stack>
      </FormGroup>
    </div>
  );
};

export default StyleHandler;
