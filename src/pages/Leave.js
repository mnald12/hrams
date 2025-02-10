import { useEffect, useState } from "react";
import Loader from "../components/Loader";
const Leave = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return <div className="leave"></div>;
  }
};

export default Leave;
