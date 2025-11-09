import { useContext, useEffect, useState } from "react";
import style from "../style.module.scss";
import { Context } from "../../../store";
import { EventHandler, debounce } from "../../../utils/home";

const initialState = {
  bold: false,
  italic: false,
  underline: false,
};

const handleDebounce = debounce((data: Partial<React.CSSProperties>) => {
  EventHandler.emit("update-style", data);
}, 300);


function normalizeFontWeight(
  v: React.CSSProperties["fontWeight"]
): "bold" | "normal" {

  if (v === "bold" || v === 700 || v === "700") return "bold";
  return "normal";
}

function normalizeFontStyle(
  v: React.CSSProperties["fontStyle"]
): "italic" | "normal" {
  return v === "italic" ? "italic" : "normal";
}

function normalizeTextDecoration(
  v: React.CSSProperties["textDecoration"]
): "underline" | "none" {
  const str = String(v ?? "");
  return str.includes("underline") ? "underline" : "none";
}
// -------------------------------------

const FontHandler = () => {
  const { state, dispatch } = useContext(Context);
  const [fontState, setFontState] = useState(initialState);
  const [fontColor, setFontColor] = useState("#000000");

  const calculateStyle = (type: "bold" | "italic" | "underline") => {
    const s = state?.nodes?.[state?.selectedNodeId]?.style ?? {};

    const current = {
      bold: normalizeFontWeight(s.fontWeight),
      italic: normalizeFontStyle(s.fontStyle),
      underline: normalizeTextDecoration(s.textDecoration),
    };

    const next = { ...current };

    if (type === "bold") {
      next.bold = current.bold === "bold" ? "normal" : "bold";
    }
    if (type === "italic") {
      next.italic = current.italic === "italic" ? "normal" : "italic";
    }
    if (type === "underline") {
      next.underline = current.underline === "underline" ? "none" : "underline";
    }

    calculateState(next);
    return next;
  };

  const calculateState = (styleState: {
    bold: "bold" | "normal";
    italic: "italic" | "normal";
    underline: "underline" | "none";
  }) => {
    setFontState({
      bold: styleState.bold === "bold",
      italic: styleState.italic === "italic",
      underline: styleState.underline === "underline",
    });
  };

  const handleClick = (type: "bold" | "italic" | "underline") => {
    const next = calculateStyle(type);

    dispatch({
      type: "addStyle",
      payload: {
        fontWeight: next.bold,          
        fontStyle: next.italic,         
        textDecoration: next.underline, 
      },
    });

    handleDebounce({
      fontWeight: next.bold,
      fontStyle: next.italic,
      textDecoration: next.underline,
    });
  };

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontColor(value);
    dispatch({ type: "addStyle", payload: { color: value } });
    handleDebounce({ color: value });
  };

  useEffect(() => {
    const s = state?.nodes?.[state?.selectedNodeId]?.style ?? {};

    const bold = normalizeFontWeight(s.fontWeight);
    const italic = normalizeFontStyle(s.fontStyle);
    const underline = normalizeTextDecoration(s.textDecoration);
    const color = (s.color as string) ?? "#000000";

    calculateState({ bold, italic, underline });
    setFontColor(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.selectedNodeId]);

  return (
    <div className={style.fontHandler}>
      <button
        className={`${style.bold} ${fontState.bold ? style.active : ""}`}
        onClick={() => handleClick("bold")}
        aria-label="Kalın"
        title="Kalın"
      >
        B
      </button>

      <button
        className={`${style.italic} ${fontState.italic ? style.active : ""}`}
        onClick={() => handleClick("italic")}
        aria-label="İtalik"
        title="İtalik"
      >
        I
      </button>

      <button
        className={`${style.underline} ${fontState.underline ? style.active : ""}`}
        onClick={() => handleClick("underline")}
        aria-label="Altı Çizili"
        title="Altı Çizili"
      >
        U
      </button>

      <input
        type="color"
        value={fontColor}
        onChange={handleFillChange}
        aria-label="Yazı Rengi Seç"
        title="Yazı Rengi Seç"
      />
    </div>
  );
};

export default FontHandler;
