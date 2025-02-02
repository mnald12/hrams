import { useEffect, useState } from "react";
import "../css/dashboard.css";
import Loader from "../components/Loader";
const Scanlog = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return <div className="scan-log"></div>;
  }
};

export default Scanlog;
