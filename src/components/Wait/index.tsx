import React, { useRef, useEffect, useCallback, useState } from "react";

interface Props {
  cb?(): void;
  ms: number;
  children: React.ReactNode;
}

const Wait = (props: Props) => {
  const { cb, ms, children } = props;
  const [isVisible, setVisible] = useState(true);
  const timerId = useRef<number>();

  const handleVisibility = useCallback(() => {
    timerId.current = window.setTimeout(() => {
      setVisible(false);
      if (cb) {
        cb();
      }
    }, ms);
  }, [ms, cb, setVisible]);

  useEffect(() => {
    handleVisibility();
    return () => {
      if (timerId.current) {
        window.clearTimeout(timerId.current);
      }
    };
  }, [handleVisibility]);

  return isVisible ? children : null;
};

export default Wait;
