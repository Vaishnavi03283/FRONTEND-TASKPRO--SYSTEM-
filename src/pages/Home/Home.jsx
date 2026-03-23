import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          TaskPro
        </div>
        <nav className={styles.nav}>
          <span>Documentation</span>
          <span>Support</span>
        </nav>
      </header>

      {/* HERO */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <span className={styles.subtitle}>ENTERPRISE TASK MANAGEMENT</span>
            <h1 className={styles.title}>
              Master Your Workflow,<br />Elevate Your Impact.
            </h1>
            <p className={styles.description}>
              Streamline team collaboration, automate workflows, and deliver projects faster with TaskPro's comprehensive task management platform.
            </p>
            <div className={styles.buttons}>
              <button 
                onClick={() => navigate("/register")} 
                className={styles.signupBtn}
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate("/login")} 
                className={styles.loginBtn}
              >
                Login
              </button>
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <div className={styles.illustration}>
              <div className={styles.laptop}>
                <div className={styles.screen}>
                  <div className={styles.dashboard}></div>
                </div>
                <div className={styles.keyboard}></div>
                <div className={styles.base}></div>
              </div>
              <div className={styles.plant}></div>
              <div className={styles.decorations}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.circle3}></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>&copy; 2023 TaskPro Technologies. Built for Enterprise Efficiency.</p>
      </footer>
    </div>
  );
};

export default Home;