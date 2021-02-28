import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";

import api from "api";

interface ResponseMapper {
  images: [];
  favourites: [];
  votes: [];
  img?: Record<string, any>;
}

interface State {
  cats: null | Record<string, any>;
  error: string;
  commonError: {
    id: string;
    message: string;
  };
}

enum ActionType {
  CATS_REQUEST,
  CATS_REQUEST_ERROR,
  CAT_COMMON_ERROR,
  CAT_COMMON_ERROR_CLEAR,
  CAT_FAVOURITE,
  CAT_UNFAVOURITE,
  CAT_UP_VOTE,
  CAT_DOWN_VOTE,
}

// Api initialization
const catApi = api.create({
  baseUrl: "https://api.thecatapi.com/v1/",
  headers: { "x-api-key": "9daa1266-85a5-4600-bef2-9e4fd71dcfa8" },
});

// @ts-ignore
const mapFavouritesAndToImage = ({ favourites, votes, img }) => {
  const result = {
    hasFavourite: false,
    favouriteId: "",
    votes: [],
    voteId: "",
  };
  const favourite = favourites.find((item: any) => item.image_id === img.id);
  if (favourite) {
    result.favouriteId = favourite.id;
    result.hasFavourite = true;
  }
  result.votes = votes.filter((item: any) => item.image_id === img.id);
  return result;
};

const mapResponse = ({ images, favourites, votes }: ResponseMapper) => {
  return images.reduce(
    (acc: Record<string, any>, item: Record<string, any>) => {
      const result = mapFavouritesAndToImage({ favourites, votes, img: item });
      acc[item.id] = {
        ...item,
        ...result,
      };
      return acc;
    },
    {}
  );
};

type Actions =
  | { type: ActionType.CATS_REQUEST; payload: Record<string, any> }
  | { type: ActionType.CATS_REQUEST_ERROR; payload: string }
  | {
      type: ActionType.CAT_FAVOURITE;
      payload: { id: string; favouriteId: string };
    }
  | { type: ActionType.CAT_UNFAVOURITE; payload: { id: string } }
  | {
      type: ActionType.CAT_UP_VOTE;
      payload: { id: string; voteId: string | number };
    }
  | {
      type: ActionType.CAT_DOWN_VOTE;
      payload: { id: string; voteId: string | number };
    }
  | {
      type: ActionType.CAT_COMMON_ERROR;
      payload: { id: string; message: string };
    }
  | {
      type: ActionType.CAT_COMMON_ERROR_CLEAR;
    };

const initialState: State = {
  error: "",
  cats: null,
  commonError: {
    id: "",
    message: "",
  },
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
    case ActionType.CAT_COMMON_ERROR:
      return {
        ...state,
        commonError: {
          ...state.commonError,
          ...action.payload,
        },
      };
    case ActionType.CAT_COMMON_ERROR_CLEAR:
      return {
        ...state,
        commonError: initialState.commonError,
      };
    case ActionType.CAT_FAVOURITE:
      const favouriteCat = state.cats![action.payload.id];
      return {
        ...state,
        cats: {
          ...state.cats,
          [action.payload.id]: {
            ...favouriteCat,
            favouriteId: action.payload.favouriteId,
            hasFavourite: true,
          },
        },
      };
    case ActionType.CAT_UNFAVOURITE:
      const unFavouriteCat = state.cats![action.payload.id];
      return {
        ...state,
        cats: {
          ...state.cats,
          [action.payload.id]: {
            ...unFavouriteCat,
            hasFavourite: false,
          },
        },
      };
    case ActionType.CAT_UP_VOTE:
      const catToUpVote = state.cats![action.payload.id];
      return {
        ...state,
        cats: {
          ...state.cats,
          [action.payload.id]: {
            ...catToUpVote,
            votes: [
              ...catToUpVote.votes,
              { image_id: action.payload.id, id: action.payload.voteId },
            ],
          },
        },
      };
    case ActionType.CAT_DOWN_VOTE:
      const catToDownVote = state.cats![action.payload.id];
      return {
        ...state,
        cats: {
          ...state.cats,
          [action.payload.id]: {
            ...catToDownVote,
            votes: catToDownVote.votes.filter(
              (item: Record<string, any>) => item.image_id !== action.payload.id
            ),
          },
        },
      };
    default:
      return state;
  }
};

export const CatContext = createContext<State | any>({
  cats: null,
  error: "",
});

CatContext.displayName = "CatProvider";

export const CatProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(catReducer, initialState);

  const getCats = useCallback(async () => {
    try {
      const [images, favourites, votes] = await Promise.all([
        catApi.get("images", { limit: 50 }),
        catApi.get("favourites", { limit: 50 }),
        catApi.get("votes", { limit: 50 }),
      ]);
      dispatch({
        type: ActionType.CATS_REQUEST,
        payload: mapResponse({ images, favourites, votes } as ResponseMapper),
      });
    } catch (error) {
      dispatch({
        type: ActionType.CATS_REQUEST_ERROR,
        payload: "something went wrong",
      });
    }
  }, []);

  const handleFavourite = useCallback(
    async (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      const image_id = e.currentTarget.getAttribute("data-cat-id")!;
      const cat = state.cats![image_id!];
      try {
        const response = await catApi.post(
          "favourites",
          {
            image_id: cat.id,
          },
          { "Content-Type": "application/json" }
        );
        dispatch({
          type: ActionType.CAT_FAVOURITE,
          payload: { id: cat.id, favouriteId: response.id as string },
        });
      } catch (err) {
        dispatch({
          type: ActionType.CAT_COMMON_ERROR,
          payload: { id: image_id!, message: "Favourite not available" },
        });
      }
    },
    [state]
  );

  const handleUnFavourite = useCallback(
    async (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const favourite_id = e.currentTarget.getAttribute("data-favourite-id");
      const catId = e.currentTarget.getAttribute("data-cat-id");
      const cat = state.cats![catId!];
      try {
        await catApi.delete(`favourites/${favourite_id}`);
        dispatch({
          type: ActionType.CAT_UNFAVOURITE,
          payload: { id: cat.id },
        });
      } catch (err) {
        dispatch({
          type: ActionType.CAT_COMMON_ERROR,
          payload: { id: catId!, message: "Favourite not available" },
        });
      }
    },
    [state]
  );

  const handleUpVote = useCallback(
    async (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const catId = event.currentTarget.getAttribute("data-cat-id");

      try {
        const cat = state.cats![catId!];
        const response = await catApi.post(
          "votes",
          {
            image_id: catId,
            value: 1,
          },
          { "Content-Type": "application/json" }
        );
        dispatch({
          type: ActionType.CAT_UP_VOTE,
          payload: { id: cat.id, voteId: response.id as string },
        });
      } catch (err) {
        dispatch({
          type: ActionType.CAT_COMMON_ERROR,
          payload: { id: catId!, message: "Vote not available" },
        });
      }
    },
    [state]
  );

  const handleDownVote = useCallback(
    async (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const catId = event.currentTarget.getAttribute("data-cat-id");

      try {
        const cat = state.cats![catId!];
        const response = await catApi.post(
          "votes",
          {
            image_id: catId,
            value: 0,
          },
          {
            "Content-Type": "application/json",
          }
        );
        dispatch({
          type: ActionType.CAT_DOWN_VOTE,
          payload: { id: cat.id, voteId: response.id as string },
        });
      } catch (err) {
        dispatch({
          type: ActionType.CAT_COMMON_ERROR,
          payload: { id: catId!, message: "Vote not available" },
        });
      }
    },
    [state]
  );

  const clearCommonError = () => {
    dispatch({
      type: ActionType.CAT_COMMON_ERROR_CLEAR,
    });
  };

  const handleUpload = useCallback(async (formData: FormData) => {
    try {
      const response = await catApi.post("images/upload", formData);
    } catch (err) {
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getCats,
      handleFavourite,
      handleUnFavourite,
      handleUpVote,
      handleDownVote,
      handleUpload,
      clearCommonError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
};

export const useCats = () => {
  const context = useContext(CatContext);
  if (context === undefined) {
    throw new Error("Please wrap children in CatProvider");
  }
  return context;
};
