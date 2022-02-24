import { FC, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import "../scss/VizTabs.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="tab-panel"
      role="tabpanel"
      hidden={value !== index}
      id={`viz-tabpanel-${index}`}
      aria-labelledby={`viz-tab-${index}`}
      style={{ borderRadius: "5px", borderTopLeftRadius: index === 0 ? "0" : "5px" }}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const VizTabs: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="viz-tab-container">
      <div>
        <Tabs
          className="tabs"
          value={activeTab}
          onChange={(evt: any, newTab: number) => {
            setActiveTab(newTab);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Dashboard" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </div>
      <div>
        <TabPanel value={activeTab} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          Item Three
        </TabPanel>
      </div>
    </div>
  );
};

export default VizTabs;
