"use client";
import React from "react";
import styles from "./MainContent.module.css";
import RestaurantTable from "./RestaurantTable";

function MainContent() {
  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1 className={styles.title}>Restaurant</h1>
        <div className={styles.profileContainer}>
          <div className={styles.avatarGroup}>
            <div className={styles.avatar}>
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="29.545"
                  cy="29.545"
                  r="29.545"
                  fill="#E8EBEC"
                ></circle>
              </svg>
            </div>
            <div className={styles.avatar}>
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="29.545"
                  cy="29.545"
                  r="29.545"
                  fill="#E8EBEC"
                ></circle>
              </svg>
            </div>
          </div>
          <div className={styles.adminInfo}>
            <svg
              width="224"
              height="60"
              viewBox="0 0 224 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="29.5442"
                cy="29.5442"
                r="29.5442"
                fill="#CCCCCC"
              ></circle>
              <text
                fill="black"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="Inter"
                fontSize="21.9864"
                fontWeight="600"
                letterSpacing="0px"
              >
                <tspan x="110.157" y="26.0392">
                  Admin
                </tspan>
              </text>
              <text
                fill="#C8C8C8"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="Inter"
                fontSize="19.2381"
                fontWeight="600"
                letterSpacing="0px"
              >
                <tspan x="86.5713" y="50.0399">
                  Admin
                </tspan>
              </text>
            </svg>
          </div>
        </div>
      </header>

      <RestaurantTable />
    </main>
  );
}

export default MainContent;
