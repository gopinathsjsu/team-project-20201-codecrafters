import React from "react";
import styles from "../styles/Dashboard.module.css";

function UserProfile({ avatarSrc, name, role }) {
  return (
    <div className={styles.div3}>
      <img src={avatarSrc} alt="User avatar" className={styles.img} />
      <div className={styles.div4}>
        <h3 className={styles.admin}>{name}</h3>
        <p className={styles.logout}>{role}</p>
      </div>
    </div>
  );
}

export default UserProfile;
