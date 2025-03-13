import React from "react";
import styles from "./ApproveNewRestaurant.module.css";
import AdminProfile from "./AdminProfile";

function AdminHeader({ title }) {
  return (
    <header className={styles.div7}>
      <h1 className={styles.dashboard2}>{title}</h1>
      <div className={styles.div8}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/86649cef-b074-4dd0-9abf-294d3590ba5c?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Notification"
          className={styles.img3}
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b64192f-5a5f-4151-9278-c1e424912e9e?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Message"
          className={styles.img4}
        />
        <AdminProfile
          imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4f87b074dd76d1f079030d71ac6723e0852501a8af3e30b860fd8e25c793ba06?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          role="Admin"
          action="Admin"
          textColorClass={styles.admin2}
          subTextColorClass={styles.admin3}
        />
      </div>
    </header>
  );
}

export default AdminHeader;
