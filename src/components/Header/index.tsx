import React from "react";
import { Link } from "react-router-dom";
import s from "./Header.module.scss";
import cn from "classnames";

function Header() {
  const rootClassNames = cn(s.root);
  return (
    <header className={rootClassNames}>
      <div className={cn("container")}>
        <div className={cn(s.wrapper)}>
          <div className={cn(s.logo)}>
            <Link className={cn(s.logoText)} to="/">
              Cats
            </Link>
          </div>
          <ul className={cn(s.navigations)}>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
