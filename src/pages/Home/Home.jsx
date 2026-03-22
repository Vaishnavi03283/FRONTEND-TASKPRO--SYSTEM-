import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  // Scroll Function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.home}>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => scrollToSection("home")}>
          TaskPro
        </div>

        <nav className={styles.nav}>
          <span onClick={() => scrollToSection("home")}>Home</span>
          <span onClick={() => scrollToSection("all")}>All</span>
          <span onClick={() => scrollToSection("about")}>About</span>
          <span onClick={() => scrollToSection("features")}>Features</span>
          <span onClick={() => scrollToSection("testimonials")}>Testimonials</span>
          <span onClick={() => scrollToSection("blog")}>Blog</span>
        </nav>

        <div className={styles.headerActions}>
          <button
            onClick={() => navigate("/login")}
            className={styles.loginBtn}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className={styles.signupBtn}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <span className={styles.tag}>Task & Project Management System</span>
            <h1>
              Simplify Project & <br /> Task Management
            </h1>
            <p>
              Organize, track, and collaborate efficiently with role-based dashboards.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={() => navigate("/register")} className={styles.primaryBtn}>
                Get Started
              </button>
              <button onClick={() => navigate("/login")} className={styles.secondaryBtn}>
                Login
              </button>
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <div className={styles.heroIllustration}>
              <div className={styles.illustrationBg}></div>
              <div className={styles.illustrationContent}>
                <div className={styles.icon}>📋</div>
                <div className={styles.icon}>👥</div>
                <div className={styles.icon}>📊</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL */}
      <section id="all" className={styles.all}>
        <h2 className={styles.sectionTitle}>Complete Dashboard System</h2>
        <div className={styles.allGrid}>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <h3>Admin Dashboard</h3>
              <p>Real-time statistics and system health</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>👥</div>
            <div className={styles.cardContent}>
              <h3>User Management</h3>
              <p>Complete user administration and access control</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>📁</div>
            <div className={styles.cardContent}>
              <h3>Project Management</h3>
              <p>Create and manage projects efficiently</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>📋</div>
            <div className={styles.cardContent}>
              <h3>Task Management</h3>
              <p>Track and complete tasks with ease</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>💬</div>
            <div className={styles.cardContent}>
              <h3>Comment System</h3>
              <p>Collaborate and communicate effectively</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>🔐</div>
            <div className={styles.cardContent}>
              <h3>Role-based Access</h3>
              <p>Secure permissions by user role</p>
            </div>
          </div>
          <div className={styles.allCard}>
            <div className={styles.cardIcon}>📈</div>
            <div className={styles.cardContent}>
              <h3>Analytics & Reports</h3>
              <p>Comprehensive insights and reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to manage at scale</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📁</div>
            <div className={styles.featureContent}>
              <h3>Project Management</h3>
              <p>Create, organize, and track projects with deadlines and milestones</p>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📋</div>
            <div className={styles.featureContent}>
              <h3>Task Tracking</h3>
              <p>Assign tasks, set priorities, and monitor progress in real-time</p>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔐</div>
            <div className={styles.featureContent}>
              <h3>Role-based Access</h3>
              <p>Secure permissions and tailored interfaces for different user roles</p>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💬</div>
            <div className={styles.featureContent}>
              <h3>Comments & Collaboration</h3>
              <p>Real-time communication and file sharing capabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutLeft}>
            <div className={styles.aboutBox}>
              <div className={styles.boxIcon}>👥</div>
              <h3>Team Collaboration</h3>
            </div>
            <div className={styles.aboutBox}>
              <div className={styles.boxIcon}>📁</div>
              <h3>Project Management</h3>
            </div>
            <div className={styles.aboutBox}>
              <div className={styles.boxIcon}>📋</div>
              <h3>Task Tracking</h3>
            </div>
            <div className={styles.aboutBox}>
              <div className={styles.boxIcon}>💬</div>
              <h3>Comments</h3>
            </div>
          </div>
          
          <div className={styles.aboutRight}>
            <h2 className={styles.aboutTitle}>About TaskPro</h2>
            <p className={styles.aboutDescription}>
              TaskPro is a comprehensive project and task management system designed to help teams organize work efficiently. 
              With role-based dashboards, real-time updates, and powerful collaboration tools, 
              TaskPro streamlines your workflow and boosts productivity.
            </p>
            <div className={styles.aboutStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>5K+</div>
                <div className={styles.statLabel}>Projects</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>25K+</div>
                <div className={styles.statLabel}>Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>Trusted by teams worldwide</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAuthor}>
                  <strong>Sarah Johnson</strong>
                  <div className={styles.testimonialRole}>Project Manager</div>
                </div>
                <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐⭐</div>
              </div>
              <p className={styles.testimonialText}>
                "TaskPro transformed how our team manages projects. The real-time dashboard and task tracking features are exactly what we needed."
              </p>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAuthor}>
                  <strong>Mike Chen</strong>
                  <div className={styles.testimonialRole}>Developer</div>
                </div>
                <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐⭐</div>
              </div>
              <p className={styles.testimonialText}>
                "The role-based access control and comment system have made our development workflow much more efficient."
              </p>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAuthor}>
                  <strong>Emily Davis</strong>
                  <div className={styles.testimonialRole}>Team Lead</div>
                </div>
                <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐⭐</div>
              </div>
              <p className={styles.testimonialText}>
                "Finally, a system that adapts to different user roles while maintaining a consistent interface."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className={styles.blog}>
        <h2 className={styles.sectionTitle}>Latest Updates & Tips</h2>
        <div className={styles.blogGrid}>
          <div className={styles.blogCard}>
            <div className={styles.blogMeta}>
              <span className={styles.blogDate}>March 15, 2024</span>
              <span className={styles.blogCategory}>Features</span>
            </div>
            <h3 className={styles.blogTitle}>New Dashboard Analytics Released</h3>
            <p className={styles.blogExcerpt}>
              Exciting new analytics features provide deeper insights into project and team performance...
            </p>
            <a href="#" className={styles.blogLink}>Read More →</a>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogMeta}>
              <span className={styles.blogDate}>March 10, 2024</span>
              <span className={styles.blogCategory}>Updates</span>
            </div>
            <h3 className={styles.blogTitle}>Mobile App Now Available</h3>
            <p className={styles.blogExcerpt}>
              Manage your projects and tasks on the go with our new mobile application...
            </p>
            <a href="#" className={styles.blogLink}>Read More →</a>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogMeta}>
              <span className={styles.blogDate}>March 1, 2024</span>
              <span className={styles.blogCategory}>Tips</span>
            </div>
            <h3 className={styles.blogTitle}>5 Ways to Improve Team Productivity</h3>
            <p className={styles.blogExcerpt}>
              Discover how to leverage TaskPro's features to boost your team's efficiency...
            </p>
            <a href="#" className={styles.blogLink}>Read More →</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>TaskPro</div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Features</a>
            <a href="#" className={styles.footerLink}>Pricing</a>
            <a href="#" className={styles.footerLink}>Contact</a>
            <a href="#" className={styles.footerLink}>Blog</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 TaskPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;