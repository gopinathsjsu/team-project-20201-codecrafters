import React from "react";
import styles from "./Dashboard.module.css";
import UserProfile from "./UserProfile";

function DashboardHeader() {
  return (
    <header className={styles.div7}>
      <div className={styles.dashboard3}>
        <h1 className={styles.dashboard4}>Dashboard</h1>
        <time className={styles.june2024}>29 June 2024</time>
      </div>
      <div className={styles.div8}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/05f016d8-d3c6-4b61-98e2-a9f721c6bac2?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Notification"
          className={styles.img3}
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c7b33993-5474-4f4b-92cf-72529c2f0a28?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Message"
          className={styles.img4}
        />
        <UserProfile
          avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4f87b074dd76d1f079030d71ac6723e0852501a8af3e30b860fd8e25c793ba06?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          name="Admin"
          role="Admin"
        />
      </div>
    </header>
  );
}

export default DashboardHeader;
