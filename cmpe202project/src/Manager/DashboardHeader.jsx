import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css";

function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <header className={styles.div7}>
      <div className={styles.dashboard3}>
        <h1 className={styles.dashboard4}>Dashboard</h1>
        <div className={styles.date}>
          <time dateTime={currentTime.toISOString()}>
            {formattedDate} {formattedTime}
          </time>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
