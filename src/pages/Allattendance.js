import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";

const Allattendances = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return <div></div>;
  }
};

export default Allattendances;
