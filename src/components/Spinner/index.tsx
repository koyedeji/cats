import React, { FC } from "react";
import cn from "classnames";
import s from "./Spinner.module.scss";

interface Props {
  className?: string;
  isLoading?: boolean;
}

const Spinner: FC<Props> = ({ className, isLoading = false }) => {
  if (!isLoading) {
    return null;
  }

  return <div className={cn(s.root, { [s.spin]: isLoading }, className)} />;
};

export default Spinner;
