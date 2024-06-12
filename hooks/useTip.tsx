import { useEffect, useState } from "react";

const useTip = () => {
  const [tip, setTip] = useState<string>("");

  const fetchTip = async () => {
    try {
      const response = await fetch(process.env.API + "/api/tip");
      const data = await response.json();
      if (response.ok) {
        setTip(data.tip);
      } else {
        setTip("An error occurred, cloudn't fetch tip.");
      }
    } catch (error) {
      console.error("Error fetching the tip:", error);
    }
  };

  useEffect(() => {
    fetchTip();
    const intervalId = setInterval(fetchTip, 180000);

    return () => clearInterval(intervalId);
  }, []);

  return tip;
};

export default useTip;
