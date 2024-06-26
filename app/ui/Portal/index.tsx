import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Portal = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);
  const el = document.createElement("div");

  useEffect(() => {
    setMounted(true);
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  if (!mounted) return null;

  return ReactDOM.createPortal(children, el);
};

export default Portal;
