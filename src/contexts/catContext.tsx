import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import * as CatAPI from "api/catApi";

interface ResponseMapper {
  images: [];
  favourites: [];
  votes: [];
  img?: Record<string, any>;
}

// @ts-ignore
const mapFavouritesAndToImage = ({ favourites, votes, img }) => {
  const result = {
    hasFavourite: false,
    favourite_id: "",
    votes: [],
    voteId: "",
  };
  const favourite = favourites.find((item: any) => item.image_id === img.id);
  if (favourite) {
    result.favourite_id = favourite.id;
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

interface State {
  cats: null | Record<string, any>;
  error: string;
}

enum ActionType {
  CATS_REQUEST,
  CATS_REQUEST_ERROR,
  CAT_FAVOURITE,
  CAT_UNFAVOURITE,
  CAT_UP_VOTE,
  CAT_DOWN_VOTE,
}

type Actions =
  | { type: ActionType.CATS_REQUEST; payload: Record<string, any> }
  | { type: ActionType.CATS_REQUEST_ERROR; payload: string }
  | {
      type: ActionType.CAT_FAVOURITE;
      payload: { id: string; favourite_id: string };
    }
  | { type: ActionType.CAT_UNFAVOURITE; payload: { id: string } }
  | {
      type: ActionType.CAT_UP_VOTE;
      payload: { id: string; voteId: string | number };
    }
  | {
      type: ActionType.CAT_DOWN_VOTE;
      payload: { id: string; voteId: string | number };
    };

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
    case ActionType.CAT_FAVOURITE:
      const favouriteCat = state.cats![action.payload.id];
      return {
        ...state,
        cats: {
          ...state.cats,
          [action.payload.id]: {
            ...favouriteCat,
            favourite_id: action.payload.favourite_id,
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

  // TODO: Show error notification for the related image
  const getCats = useCallback(async () => {
    try {
      const [images, favourites, votes] = await Promise.all([
        CatAPI.get("images?limit=50"),
        CatAPI.get("favourites?limit=50"),
        CatAPI.get("votes?limit=50"),
      ]);

      dispatch({
        type: ActionType.CATS_REQUEST,
        payload: mapResponse({ images, favourites, votes } as ResponseMapper),
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // TODO: Show error notification for the related image
  const handleFavourite = useCallback(
    async (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      const image_id = e.currentTarget.getAttribute("data-cat-id");
      const cat = state.cats![image_id!];
      try {
        const response = await CatAPI.post("favourites", {
          image_id: cat.id,
        });
        dispatch({
          type: ActionType.CAT_FAVOURITE,
          payload: { id: cat.id, favourite_id: response.id as string },
        });
      } catch (err) {
        // TODO: dispatch common error state here with the image id
        throw err;
      }
    },
    [state]
  );

  // TODO: Show error notification for the related image
  const handleUnFavourite = useCallback(
    async (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const favourite_id = e.currentTarget.getAttribute("data-favourite-id");
      const catId = e.currentTarget.getAttribute("data-cat-id");
      const cat = state.cats![catId!];
      try {
        await CatAPI.remove(`favourites/${favourite_id}`);
        dispatch({
          type: ActionType.CAT_UNFAVOURITE,
          payload: { id: cat.id },
        });
      } catch (err) {
        // TODO: dispatch common error state here with the image id
        throw err;
      }
    },
    [state]
  );

  // TODO: Show error notification for the related image
  const handleUpVote = async (
    event: SyntheticEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const catId = event.currentTarget.getAttribute("data-cat-id");

    try {
      const cat = state.cats![catId!];
      const response = await CatAPI.post("votes", {
        image_id: catId,
        value: 1,
      });
      dispatch({
        type: ActionType.CAT_UP_VOTE,
        payload: { id: cat.id, voteId: response.id as string },
      });
    } catch (err) {
      // TODO: dispatch common error state here with the image id
      throw err;
    }
  };

  // TODO: Show error notification for the related image
  const handleDownVote = async (
    event: SyntheticEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const catId = event.currentTarget.getAttribute("data-cat-id"); // increnment or decrement

    try {
      const cat = state.cats![catId!];

      const response = await CatAPI.post("votes", {
        image_id: catId,
        value: 0,
      });
      dispatch({
        type: ActionType.CAT_DOWN_VOTE,
        payload: { id: cat.id, voteId: response.id as string },
      });
    } catch (err) {
      // TODO: dispatch common error state here with the image id
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      getCats,
      handleFavourite,
      handleUnFavourite,
      handleUpVote,
      handleDownVote,
    }),
    [getCats, handleFavourite, handleUnFavourite, state]
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
