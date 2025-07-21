import { useEffect, useState } from "react";
import { FixTypeLater } from "react-redux";

// Custom hook for managing the timer state
const useTimer = (staticTime: string | FixTypeLater) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isLessThanTenMinutes, setIsLessThanTenMinutes] = useState(false);
  useEffect(() => {
    if (staticTime) {
      // Convert the initial value to milliseconds
      const [days, hours, minutes, seconds] = staticTime.split(":").map(Number);
      let initialTime = (hours * 3600 + minutes * 60 + seconds) * 1000;

      // Update the timer every second
      const interval = setInterval(() => {
        // Decrease the time left by one second
        initialTime -= 1000;

        // If time has passed, stop the timer
        if (initialTime <= 0) {
          clearInterval(interval);
          setTimeLeft("00:00:00");
        } else {
          // Format the updated time and set the new value
          const newHours = Math.floor(initialTime / (1000 * 60 * 60));
          const newMinutes = Math.floor(
            (initialTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          const newSeconds = Math.floor((initialTime % (1000 * 60)) / 1000);
          if (days > 0) {
            const time = `${days}:${newHours < 10 ? "0" + newHours : newHours}:${newMinutes < 10 ? "0" + newMinutes : newMinutes}:${newSeconds < 10 ? "0" + newSeconds : newSeconds}`;
            setIsLessThanTenMinutes(time <= "00:00:10:00");
            setTimeLeft(time);
          } else if (newHours > 0) {
            const time = `${newHours < 10 ? "0" + newHours : newHours}:${newMinutes < 10 ? "0" + newMinutes : newMinutes}:${newSeconds < 10 ? "0" + newSeconds : newSeconds}`;
            setIsLessThanTenMinutes(time <= "00:10:00");
            setTimeLeft(time);
          } else if (newMinutes > 0) {
            const time = `00:${newMinutes < 10 ? "0" + newMinutes : newMinutes}:${newSeconds < 10 ? "0" + newSeconds : newSeconds}`;
            setIsLessThanTenMinutes(time <= "00:10:00");
            setTimeLeft(time);
          } else if (newSeconds > 0) {
            const time = `00:00:${newSeconds < 10 ? "0" + newSeconds : newSeconds}`;
            setIsLessThanTenMinutes(true);
            setTimeLeft(time);
          } else {
            setTimeLeft("00:00:00");
            setIsLessThanTenMinutes(true);
          }
        }
      }, 1000);

      // Clean up the interval on component unmount or when staticTime changes
      return () => clearInterval(interval);
    }
  }, [staticTime]);

  return { timeLeft, isLessThanTenMinutes };
};

// Combining both hooks into a single custom hook
const useDynamicTimer = (staticTime: string | FixTypeLater) => {
  const { timeLeft, isLessThanTenMinutes } = useTimer(staticTime);

  return { timeLeft, isLessThanTenMinutes };
};

export default useDynamicTimer;
