import { FC } from "react";
import FilterList from "../components/FilterList";
import Overview from "../components/Overview";
import VizTabs from "../components/VizTabs";

import "../scss/DataView.scss";

const DataView: FC = () => {
  return (
    <div className="data-container">
      <section className="filters">
        <FilterList />
      </section>
      <section className="visualizations">
        <Overview />
        <VizTabs />
      </section>
    </div>
  );
};

export default DataView;
