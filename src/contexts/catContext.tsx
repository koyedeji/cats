import React, { createContext, useReducer, FC, useMemo } from "react";
import * as CatAPI from "api/Cat";

const mapResponseToObj = (items: []) => {
  return items.reduce((acc: Record<string, any>, curr: Record<string, any>) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
};

interface State {
  cats: null | Record<string, any>;
  error: string;
}

enum ActionType {
  CATS_REQUEST,
  CATS_REQUEST_ERROR,
}

type Actions =
  | { type: ActionType.CATS_REQUEST; payload: Record<string, any> }
  | { type: ActionType.CATS_REQUEST_ERROR; payload: string };

const initialState: State = {
  error: "",
  cats: null,
};

const catReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionType.CATS_REQUEST_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionType.CATS_REQUEST:
      return {
        ...state,
        cats: action.payload,
      };
    default:
      return state;
  }
};

const CatContext = createContext<State | any>({
  cats: null,
  error: "",
});

CatContext.displayName = "CatProvider";

const Provider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(catReducer, initialState);

  const getCats = async () => {
    const { error, data } = await CatAPI.get("images/limit=50");
    if (error) {
      dispatch({ type: ActionType.CATS_REQUEST_ERROR, payload: error });
      return;
    }

    dispatch({
      type: ActionType.CATS_REQUEST,
      payload: mapResponseToObj(data as []),
    });
  };

  const value = useMemo(
    () => ({
      ...state,
      getCats,
    }),
    [state]
  );

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
};
