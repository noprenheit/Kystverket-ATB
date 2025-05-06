# Kystverket - ATB

This project is an enhanced mobile application inspired by the Norwegian coastal weather app, Kystvær. It aims to provide detailed weather and wind information for lighthouse locations along the Norwegian coast, with improved functionalities and a better user experience using interactive flashcards for forecasts.

## Project Goals & Features

The application builds upon the core concept of Kystvær by introducing several key enhancements:

*   **Weather Flashcards:**  
    Introduces a unique flashcard component to visualize weather conditions at selected lighthouses.  
    This required careful state management to ensure data consistency and performance.

*   **Weather Flashcards:**  
    Introduces a unique flashcard component to visualize weather conditions at selected lighthouses.  
    This required careful state management to ensure data consistency and performance.

    <table align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 0 1rem;">
          <img
            src="https://github.com/user-attachments/assets/d0d97825-1852-40a7-88e7-db7ea95a9ff8"
            alt="iOS Weather Card"
            width="200"
            style="display: block; margin-bottom: 0.25rem;"
          />
          <div style="font-size: 0.9rem; margin: 0;">Figure: iOS screenshot</div>
        </td>
        <td align="center" style="padding: 0 1rem;">
          <img
            src="https://github.com/user-attachments/assets/13a1c1a2-2750-4128-9d3e-3c93ac3bf2ed"
            alt="Android Weather Card"
            width="200"
            style="display: block; margin-bottom: 0.25rem;"
          />
          <div style="font-size: 0.9rem; margin: 0;">Figure: Android screenshot</div>
        </td>
      </tr>
    </table>

*   **Interactive Map:**  
    Leverages react-native-maps to display lighthouse locations.  
    Integrating real-time data overlays and smooth panning/zooming presented interesting technical challenges.

    <table align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 0 1rem;">
          <img
            src="https://github.com/user-attachments/assets/ab5cd62f-f95e-4775-a735-7f19a43b5a57"
            alt="iOS Map"
            width="200"
            style="display: block; margin-bottom: 0.25rem;"
          />
          <div style="font-size: 0.9rem; margin: 0;">Figure: iOS screenshot</div>
        </td>
        <td align="center" style="padding: 0 1rem;">
          <img
            src="https://github.com/user-attachments/assets/a6cd7845-8617-4638-85e4-da4422a0c361"
            alt="Android Map"
            width="200"
            style="display: block; margin-bottom: 0.25rem;"
          />
          <div style="font-size: 0.9rem; margin: 0;">Figure: Android screenshot</div>
        </td>
      </tr>
    </table>



*   **Detailed Forecasts:** Fetches and displays current conditions and 48-hour forecasts (wind, temperature, waves, tides) from a weather API, involving asynchronous data handling and caching strategies.
*   **Robust Tech Stack:** Built using React Native (Expo) and TypeScript for type safety and maintainability. Utilized MobX for state management, effectively handling the app's reactive data flow.

## Key Functionalities

*   📍 Interactive map displaying Norwegian lighthouses.
*   ☀️ Real-time weather data sourced via weatherAPI.
*   📊 48-hour forecast charts using react-native-chart-kit.
*   🔍 **NEW:** Search and filter capabilities for lighthouses.
*   🃏 **NEW:** Weather flashcard mode for quick information synthesis.
*   ⚙️ User settings for units (m/s vs knots) and map preferences. (WIP)
*   🌍 Multilingual support (English and Norwegian) via i18n-js.

## Getting Started

1.  npm install
2.  Create a .env file and configure the necessary API key for weatherAPI
3.  npx expo start

## Core Technologies

*   **Framework:** React Native (Expo)
*   **Language:** TypeScript
*   **State Management:** MobX (addresses challenges in managing asynchronous data and shared state across components)
*   **Mapping:** react-native-maps (with custom markers and potential tile overlays)
*   **Charting:** react-native-chart-kit
*   **API Integration:** axios for fetching data from external weather services.
*   **Storage:** @react-native-async-storage/async-storage for caching and user preferences.
*   **Localization:** i18n-js and react-native-localize.

## Potential Future Enhancements

*   Offline map caching.
*   Advanced notification system for weather alerts.
*   Integration of additional data sources.
*   Route planning.

<p align="center">
  <a href="https://youtu.be/i1ldTNM5oSM">
    <img
      src="https://img.youtube.com/vi/i1ldTNM5oSM/0.jpg"
      alt="Demo of the weather flashcards interaction"
      width="400"
      style="display: block; margin-bottom: 0.5rem;"
    />
  </a>
  <br/>
  <sub style="font-size: 0.9rem;">
    Figure: Demo of the weather flashcards interaction  
    (<a href="https://youtu.be/i1ldTNM5oSM">Watch on YouTube</a>)
  </sub>
</p>
