import React, { FC } from "react";
import { Link } from "react-router-dom";
import s from "./Header.module.scss";
import cn from "classnames";

function Header() {
  const rootClassNames = cn("container", s.root);
  return (
    <header className={rootClassNames}>
      <div className={cn(s.logo)}>
        <Link to="/">Home</Link>
      </div>
      <ul className={cn(s.navigations)}>
        <li>
          <Link to="/">Upload</Link>
        </li>
      </ul>
    </header>
  );
}
