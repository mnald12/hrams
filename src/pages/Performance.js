import { useEffect, useState } from "react";
import "../css/dashboard.css";
import Loader from "../components/Loader";
const Performance = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return <div className="performance"></div>;
  }
};

export default Performance;
