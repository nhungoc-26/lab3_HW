
import { initialCrateDrops } from "../data/crateDrops";
import CrateCard from "./CrateCard";

function AirdropSection() {
  return (
    <section className="airdrop-section" id="airdrop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LIMITED TIME EVENT</p>
          <h2>G-COIN CONTRABAND DROPS</h2>
          <p>Claim exclusive loot before the supply runs out.</p>
        </div>
      </div>

      <div className="crate-grid">
        {initialCrateDrops.map((crate) => (
          <CrateCard key={crate.id} crate={crate} />
        ))}
      </div>
    </section>
  );
}

export default AirdropSection;
