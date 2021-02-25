import React, { FC } from "react";
import cn from "classnames";
import Cat from "./Cat";
import { useCats } from "contexts/catContext";
import s from "./CatList.module.scss";
interface CatListProps {
  className?: string;
}
const CatList: FC<CatListProps> = (props) => {
  const {
    handleUnFavourite,
    handleFavourite,
    handleUpVote,
    handleDownVote,
    cats,
  } = useCats();
  const { className } = props;
  const rootClassnames = cn(s.root, className);

  if (Object.values(cats).length === 0) {
    return (
      <p>
        You currently don't have any cats. click the upload button to load a new
        cat
      </p>
    );
  }

  return (
    <ul className={cn(rootClassnames)}>
      {Object.values(cats as Record<string, any>).map((node) => {
        return (
          <Cat
            key={node.id}
            id={node.id}
            votes={node.votes}
            voteId={node.voteId}
            hasFavourite={node.hasFavourite}
            favourite_id={node.favourite_id}
            imgUrl={node.url}
            handleFavourite={handleFavourite}
            handleUnFavourite={handleUnFavourite}
            handleUpVote={handleUpVote}
            handleDownVote={handleDownVote}
          />
        );
      })}
    </ul>
  );
};

export default CatList;
