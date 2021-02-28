import React, { SyntheticEvent } from "react";
import cn from "classnames";
import Wait from "components/Wait";
import s from "./CatList.module.scss";

interface Props {
  id: string;
  voteId: string;
  votes: [];
  hasFavourite: boolean;
  favouriteId: string;
  imgUrl: string;
  errorMessage?: string;
  handleFavourite(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleUnFavourite(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleUpVote(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleDownVote(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  clearCommonError(): void;
}

type VoteButtonProps = Pick<
  Props,
  "handleUpVote" | "handleDownVote" | "id" | "errorMessage"
>;

type FavouriteButtonProps = Pick<
  Props,
  | "handleUnFavourite"
  | "handleFavourite"
  | "favouriteId"
  | "hasFavourite"
  | "id"
  | "errorMessage"
  | "clearCommonError"
>;

function Cat(props: Props) {
  const {
    id,
    imgUrl,
    hasFavourite,
    favouriteId,
    handleUnFavourite,
    handleFavourite,
    handleUpVote,
    handleDownVote,
    votes,
    errorMessage,
    clearCommonError,
  } = props;

  return (
    <li className={cn(s.container)}>
      <Cat.Image imgUrl={imgUrl} />
      <Cat.FavouriteButtons
        id={id}
        clearCommonError={clearCommonError}
        errorMessage={errorMessage}
        handleUnFavourite={handleUnFavourite}
        handleFavourite={handleFavourite}
        favouriteId={favouriteId}
        hasFavourite={hasFavourite}
      />
      <div className={cn(s.bottom)}>
        <Cat.VoteButtons
          id={id}
          handleDownVote={handleDownVote}
          handleUpVote={handleUpVote}
          errorMessage={errorMessage}
        />
        <Cat.VoteCount count={votes.length} />
      </div>
    </li>
  );
}

Cat.Image = (props: Pick<Props, "imgUrl">) => {
  const { imgUrl } = props;
  return (
    <div className={cn(s.imgContainer)}>
      <img
        className={cn(s.img)}
        src={
          imgUrl ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3hTQwsrGuYW0XGXbIB4d2noVL1ZhL7llERA&usqp=CAU"
        }
        alt="cats"
      />
    </div>
  );
};

Cat.FavouriteButtons = (props: FavouriteButtonProps) => {
  const {
    handleUnFavourite,
    handleFavourite,
    favouriteId,
    hasFavourite,
    errorMessage,
    clearCommonError,
    id,
  } = props;

  if (errorMessage) {
    return (
      // @ts-ignore
      <Wait ms={5000} cb={clearCommonError}>
        <div className={cn(s.top)}>
          <span className="error-text">{errorMessage}</span>
        </div>
      </Wait>
    );
  }

  return (
    <div className={cn(s.top)}>
      {hasFavourite ? (
        <button
          onClick={handleUnFavourite}
          data-favourite-id={favouriteId}
          data-cat-id={id}
          type="button"
        >
          <span style={{ color: "red" }} className="material-icons">
            favorite
          </span>
        </button>
      ) : (
        <button onClick={handleFavourite} data-cat-id={id} type="button">
          <span className="material-icons">favorite_border</span>
        </button>
      )}
    </div>
  );
};

Cat.VoteCount = ({ count }: { count: number }) => {
  return <p className={cn(s.count)}>{count}</p>;
};

Cat.VoteButtons = (props: VoteButtonProps) => {
  const { handleDownVote, handleUpVote, id, errorMessage } = props;
  if (errorMessage) {
    return <p className={"error-text"}>{errorMessage}</p>;
  }
  return (
    <div>
      <button
        onClick={handleUpVote}
        data-cat-id={id}
        data-vote-action="increment"
        className={cn(s.btn)}
        type="button"
      >
        <span className="material-icons">thumb_up_off_alt</span>
      </button>
      <button
        onClick={handleDownVote}
        className={cn(s.btn)}
        data-cat-id={id}
        data-vote-action="decrement"
        type="button"
      >
        <span className="material-icons">thumb_down_off_alt</span>
      </button>
    </div>
  );
};

export default Cat;
