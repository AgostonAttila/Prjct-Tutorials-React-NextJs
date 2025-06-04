"use dom";
import React from "react";
import styles from "./Landing.module.css";

type LandingProps = {
  onGoogleSignIn: () => void;
  onEmailSignIn: () => void;
  onPrivacyPolicy: () => void;
};

export default function Landing({
  onGoogleSignIn,
  onEmailSignIn,
  onPrivacyPolicy,
}: LandingProps) {
  return (
    <div className={styles.container}>
       <header className={styles.header}>
        <img
          src={`${process.env.EXPO_BASE_URL}${
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "/icon-dark.png"
              : "/icon.png"
          }`}
          alt="App Icon"
          width={40}
          height={40}
          className={styles.headerLogo}
        />
      </header>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.welcomeText}>Shopping List:<br/>Sync & Share</h1>
            <p className={styles.subtitleText}>
              Streamline your shopping experience with our collaborative,
              real-time shopping list app.
              <br/>
              Create, share and sync lists instantly
              with family and friends to make shopping together effortless.
            </p>
            <div className={styles.heroActions}>
              <button
                onClick={onGoogleSignIn}
                className={`${styles.button} ${styles.googleButton}`}
              >
                <img
                  src={`${process.env.EXPO_BASE_URL}/google-icon.png`}
                  alt="Google Icon"
                  width={20}
                  height={20}
                  className={styles.googleLogo}
                />
                Sign in with Google
              </button>

              <button onClick={onEmailSignIn} className={styles.button}>
                Sign in with Email
              </button>

             
            </div>
          </div>
          <div className={styles.appStoreContainer}>
          <img
            src={`${process.env.EXPO_BASE_URL}/iphone-landing.webp`}
            alt="App Icon"
            width={340}
            height={366}
            className={styles.appIcon}
          />
          <a
                className={styles.appStoreButton}
                href="https://apps.apple.com/us/app/shopping-list-sync-share/id6739513017"
              >
                <img
                  src={`${process.env.EXPO_BASE_URL}/apple-badge.svg`}
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                />
              </a>
          </div>
        
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Features</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <h3>👨‍👩‍👧‍👦 Real-time Collaboration</h3>
            <p>Share lists with family and friends</p>
          </div>

          <div className={styles.featureItem}>
            <h3>🔄 Offline Support</h3>
            <p>Works even without an internet connection</p>
          </div>

          <div className={styles.featureItem}>
            <h3>📱 Cross-Platform</h3>
            <p>Available on iOS, Android, and Web</p>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <button onClick={onPrivacyPolicy} className={styles.privacyButton}>
          Privacy Policy
        </button>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Shopping List App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
