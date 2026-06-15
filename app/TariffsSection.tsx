import GetCourseWidget from "./GetCourseWidget";
import { tariffBonuses, tariffs } from "./tariffsData";

function Price({ value }: { value: string }) {
  const parts = value.split(" ");
  const currency = parts.pop();
  const amount = parts.join(" ");

  return (
    <>
      {amount} <span>{currency}</span>
    </>
  );
}

type TariffsSectionProps = {
  className?: string;
  title?: string;
  intro?: string;
};

export default function TariffsSection({
  className = "",
  title = "Выберите тариф:",
  intro,
}: TariffsSectionProps) {
  return (
    <section className={`section tariffs ${className}`} id="tariffs">
      <div className="tariff-head" data-reveal>
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
      <div className="tariff-grid" data-stagger>
        {tariffs.map((tariff) => (
          <article
            className={`tariff-card ${tariff.accent ? "is-accent" : ""}`}
            key={tariff.name}
            data-item
          >
            <div className="tariff-top">
              <h3>{tariff.name}</h3>
            </div>
            <div className="tariff-desc">
              <p>{tariff.text}</p>
            </div>
            <div className="price-row">
              <small>{tariff.oldPrice}</small>
              <strong><Price value={tariff.price} /></strong>
            </div>
            <ul>
              {tariff.includes.map((item) => (
                <li className={item.startsWith("Всё") ? "is-summary" : item.startsWith("🎁") ? "is-gift" : ""} key={item}>{item}</li>
              ))}
            </ul>
            <GetCourseWidget
              className={tariff.accent ? "is-light" : "is-dark"}
              widgetId={tariff.widgetId}
            />
          </article>
        ))}
      </div>
      <div className="bonus-stack" data-stagger>
        {tariffBonuses.map((bonus) => (
          <article className="bonus-panel" key={bonus.title} data-item>
            <span>{bonus.eyebrow}</span>
            <h3>{bonus.title}</h3>
            <ul>
              {bonus.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {"note" in bonus && bonus.note ? <p>{bonus.note}</p> : null}
            {"cta" in bonus && bonus.cta ? (
              <a className="bonus-upgrade" href={bonus.href}>
                {bonus.cta}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
