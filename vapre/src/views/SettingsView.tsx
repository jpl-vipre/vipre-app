import { FC } from "react";

import "../scss/SettingsView.scss";

const SettingsView: FC = () => {
  return (
    <div className="settings-container">
      <div style={{ display: "flex", justifyContent: "center", padding: "15px" }}>
        <h1>Settings</h1>
      </div>
    </div>
  );
};

export default SettingsView;
