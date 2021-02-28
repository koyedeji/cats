import React, { useEffect, FC } from "react";
import { useCats } from "contexts/catContext";
import Spinner from "components/Spinner";
import CatList from "components/CatList";
import s from "./Home.module.scss";

const HomePage: FC = () => {
  const { getCats, cats, error } = useCats();

  useEffect(() => {
    (async () => {
      await getCats();
    })();
  }, [getCats]);

  const isLoading = cats === null;

  return (
    <section className="section">
      <div className="container">
        {isLoading && error ? (
          <p className="error-text">{error}</p>
        ) : isLoading && !error ? (
          <Spinner isLoading={isLoading} className={s.spinner} />
        ) : (
          <CatList />
        )}
      </div>
    </section>
  );
};

export default HomePage;
