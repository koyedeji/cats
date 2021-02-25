import React, { FC, SyntheticEvent } from "react";
import cn from "classnames";
import s from "./CatList.module.scss";

interface Props {
  id: string;
  voteId: string;
  votes: [];
  hasFavourite: boolean;
  favourite_id: string;
  imgUrl: string;
  handleFavourite(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleUnFavourite(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleUpVote(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
  handleDownVote(e: SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
}

const Cat: FC<Props> = (props) => {
  const {
    id,
    imgUrl,
    hasFavourite,
    favourite_id,
    handleUnFavourite,
    handleFavourite,
    handleUpVote,
    handleDownVote,
    votes,
  } = props;
  return (
    <li className={cn(s.container)}>
      <div className={cn(s.top)}>
        {hasFavourite ? (
          <button
            onClick={handleUnFavourite}
            data-favourite-id={favourite_id}
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
      <div className={cn(s.bottom)}>
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
        <p className={cn(s.count)}>{votes!.length}</p>
      </div>
    </li>
  );
};

export default Cat;
