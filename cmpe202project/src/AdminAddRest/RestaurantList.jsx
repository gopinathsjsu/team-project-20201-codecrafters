import React from "react";
import styles from "../styles/ApproveNewRestaurant.module.css";

function RestaurantList({ restaurants }) {
  return (
    <div className={styles.div15}>
      <div className={styles.div16}>
        {/* Restaurant Names Column */}
        <div className={styles.div17}>
          {restaurants.map((restaurant, index) => (
            <div
              key={`name-${index}`}
              className={
                index === 0
                  ? styles.artisanWonders
                  : index === 1
                    ? styles.sereneHarbor
                    : index === 2
                      ? styles.urbanNest
                      : index === 3
                        ? styles.velvetBoutique
                        : index === 4
                          ? styles.mystiKraft
                          : index === 5
                            ? styles.poshPalette
                            : styles.vintageVista
              }
            >
              {restaurant.name}
            </div>
          ))}
        </div>

        {/* Locations Column */}
        <div className={styles.div18}>
          {restaurants.map((restaurant, index) => (
            <div
              key={`location-${index}`}
              className={
                index === 0
                  ? styles.washingtonCalifornia
                  : index === 1
                    ? styles.washingtonGeorgia
                    : index === 2
                      ? styles.franklinLowa
                      : index === 3
                        ? styles.clintonIndiana
                        : index === 4
                          ? styles.centervilleMontana
                          : index === 5
                            ? styles.washingtonCalifornia2
                            : styles.greenvilleLowa
              }
            >
              {restaurant.location}
            </div>
          ))}
        </div>

        {/* Quantities Column */}
        <div className={styles.div19}>
          {restaurants.map((restaurant, index) => (
            <div
              key={`quantity-${index}`}
              className={
                index === 0
                  ? ""
                  : index === 1
                    ? styles.quantity
                    : index === 2
                      ? styles.quantity2
                      : index === 3
                        ? styles.quantity3
                        : index === 4
                          ? styles.quantity4
                          : index === 5
                            ? styles.quantity5
                            : styles.quantity6
              }
            >
              {restaurant.quantity}
            </div>
          ))}
        </div>
      </div>

      {/* Selection Indicators */}
      <div className={styles.div20}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2ddd07118affd2a42244b7a423fb706c79640e720dfe42359110961af95f5b?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Select indicator"
          className={styles.img5}
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2ddd07118affd2a42244b7a423fb706c79640e720dfe42359110961af95f5b?placeholderIfAbsent=true&apiKey=7d0e67a8cdae44a9b9e940d111f39a07"
          alt="Select indicator"
          className={styles.img6}
        />
      </div>
    </div>
  );
}

export default RestaurantList;
