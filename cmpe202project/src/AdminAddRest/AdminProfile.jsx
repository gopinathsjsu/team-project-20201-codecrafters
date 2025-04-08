import React from "react";
import styles from "../styles/ApproveNewRestaurant.module.css";

function AdminProfile({
  imgSrc,
  role,
  action,
  textColorClass,
  subTextColorClass,
}) {
  return (
    <div className={styles.div3}>
      <img src={imgSrc} alt="Admin profile" className={styles.img} />
      <div className={styles.div4}>
        <h3 className={textColorClass || styles.admin}>{role}</h3>
        <p className={subTextColorClass || styles.logout}>{action}</p>
      </div>
    </div>
  );
}

export default AdminProfile;
