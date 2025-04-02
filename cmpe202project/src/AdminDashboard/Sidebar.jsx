import React from "react";
import styles from "./Dashboard.module.css";
import UserProfile from "./UserProfile";

function Sidebar() {
  return (
    <aside className={styles.column}>
      <nav className={styles.taskbar}>
        <h2 className={styles.dashboard2}>Dashboard</h2>
        <h2 className={styles.restaurant}>Restaurant</h2>
        <h2 className={styles.approveNewRestaurant}>Approve New Restaurant</h2>
        <div className={styles.div2}>
          <UserProfile
            avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4f87b074dd76d1f079030d71ac6723e0852501a8af3e30b860fd8e25c793ba06?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
            name="Admin"
            role="Logout"
          />
          <button className={styles.div5}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b31bab04a6d70d73d6f6c29bed340b02ab3b311d94240b870d93268734e9107?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
              alt="Settings"
              className={styles.img2}
            />
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
