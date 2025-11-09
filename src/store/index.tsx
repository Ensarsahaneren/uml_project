/* eslint-disable react-refresh/only-export-components */
// src/store/index.tsx

import { createContext, useReducer } from "react";
import type { Dispatch, PropsWithChildren, CSSProperties } from "react";
import type { XYPosition } from "@xyflow/react";
import { NodeType } from "../utils/home";

export type NodeDataType = {
  type: NodeType | string;
  label?: string;            // ← eklendi (opsiyonel)
  // gerekirse ileride başka alanlar da eklenebilir
};


export type PropertiesType = {
  id: string;
  type: NodeType | string;
  position: XYPosition;
  data: NodeDataType;         // ← burada kullan
  style: CSSProperties;
};
export type InitialStateType = {
  nodes: Record<string, PropertiesType>;
  selectedNodeId: string;
  currentType: NodeType | string | "";
};

export const initialState: InitialStateType = {
  nodes: {},
  selectedNodeId: "",
  currentType: "",
};

export type AddAction = { type: "add"; payload: PropertiesType };
export type SelectedNodeAction = {
  type: "selectedNode";
  payload: { id: string };
};
export type AddStyleAction = {
  type: "addStyle";
  payload: Partial<CSSProperties>;
};
export type ChangeTypeAction = {
  type: "change-type";
  payload: { currentType: NodeType | string };
};

export type Action =
  | AddAction
  | SelectedNodeAction
  | AddStyleAction
  | ChangeTypeAction;

export const Context = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
 
  dispatch: (() => {}) as unknown as Dispatch<Action>,
});


export function stateReducer(
  state: InitialStateType,
  action: Action
): InitialStateType {
  switch (action.type) {
    case "add": {
      const node = action.payload;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [node.id]: { ...(state.nodes[node.id] ?? {}), ...node },
        },
      };
    }
    case "selectedNode": {
      const { id } = action.payload;
      return { ...state, selectedNodeId: id };
    }
    
    case "addStyle": {
      const id = state.selectedNodeId;
      if (!id) return state;
      const prevNode = state.nodes[id];
      if (!prevNode) return state;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: {
            ...prevNode,
            style: { ...prevNode.style, ...action.payload },
          },
        },
      };
    }
    case "change-type":
      return { ...state, currentType: action.payload.currentType };

    default:
      return state;
  }
}


function Provider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}

export default Provider;
