import "../css/performance.css";
import { useState, useEffect } from "react";
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
    return <div className="card-container"></div>;
  }
};
export default Performance;
