import React, { FC } from "react";
import cn from "classnames";
import Header from "../Header";
import { CatProvider } from "contexts/catContext";
import s from "./Layout.module.scss";

const Layout: FC = ({ children }) => {
  return (
    <CatProvider>
      <div className={cn(s.layout)}>
        <Header />
        <main>{children}</main>
      </div>
    </CatProvider>
  );
};

export default Layout;
