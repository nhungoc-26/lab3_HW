
import AirdropSection from "./components/AirdropSection";
import Leaderboard from "./components/Leaderboard";
import KillFeed from "./components/KillFeed";
import "./App.css";

function App() {
  return (
    <main className="pubg-app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">P</span>
          <div>
            <strong>PUBG VIETNAM</strong>
            <small>CHAMPIONSHIP ARENA</small>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <a href="#airdrop">Airdrop</a>
          <a href="#leaderboard">Leaderboard</a>
          <a href="#kill-feed">Kill Feed</a>
        </nav>

        <span className="event-tag">PVS FINALS 2026</span>
      </header>

      <section className="hero-section" id="hero">
        <div className="hero-content">
          <span className="hero-label">KRAFTON PRESENTS</span>
          <h1>
            PUBG VIETNAM
            <span>CHAMPIONSHIP</span>
          </h1>
          <p>
            Fight for glory. Claim your loot. Become the champion.
          </p>
          <a className="hero-button" href="#leaderboard">
            VIEW ARENA
          </a>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <span>PVS</span>
          <span>2026</span>
        </div>
      </section>

      <div className="arena-container">
        <section className="event-overview">
          <div>
            <span className="overview-label">TOURNAMENT</span>
            <strong>PUBG Vietnam Series</strong>
          </div>

          <div>
            <span className="overview-label">EVENT</span>
            <strong>Grand Finals</strong>
          </div>

          <div>
            <span className="overview-label">REGION</span>
            <strong>Vietnam</strong>
          </div>

          <div>
            <span className="overview-label">STATUS</span>
            <strong className="demo-status">DEMO ARENA</strong>
          </div>
        </section>

        {/* AIRDROP CRATES */}
        <AirdropSection />

        {/* LEADERBOARD */}
        <section id="leaderboard">
          <Leaderboard />
        </section>

        {/* KILL FEED */}
        <section id="kill-feed">
          <KillFeed />
        </section>
      </div>

      <footer className="site-footer">
        <p>PUBG VIETNAM CHAMPIONSHIP © 2026</p>
        <p>Fan-made educational project. Not an official PUBG website.</p>
      </footer>
    </main>
  );
}

export default App;
