import React, { useEffect, FC } from "react";
import { useCats } from "contexts/catContext";
import CatList from "components/CatList";

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
          <p style={{ color: "red" }}>{error}</p>
        ) : isLoading && !error ? (
          <div>
            <p>Spinner.... or skeleton....</p>
          </div>
        ) : (
          <CatList />
        )}
      </div>
    </section>
  );
};

export default HomePage;
