import { useState, useContext } from "react";
import { campaigns } from "../../../data/campaigns.js";
import CampaignCard from "./campaignCard/CampaignCard.jsx";
import CampaignSearch from "./CampaignSearch.jsx";
import CampaignsTable from "./CampaignsTable.jsx";
import AuthContext from "../../../services/authContext/AuthContext";
import { ROLES } from "../../../services/authContext/auth.utils";

const CampaignsList = () => {
  const [search, setSearch] = useState("");
  const { isAuthenticated, role } = useContext(AuthContext);

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
  };

  const isAdmin = isAuthenticated && role === ROLES.ADMIN;

  if (isAdmin) {
    return (
      <div className="mt-2 mx-4 campaigns-list-wrapper">
        <h1>Campaigns</h1>
        <CampaignsTable />
      </div>
    );
  }

  const mappedCampaigns = campaigns
    .filter((campaign) => {
      const query = search.toLowerCase();
      return (
        campaign.entityName.toLowerCase().includes(query) ||
        campaign.location.toLowerCase().includes(query)
      );
    })
    .map((campaign) => (
      <CampaignCard
        key={campaign.id}
        entityName={campaign.entityName}
        bloodType={campaign.bloodType}
        date={campaign.date}
        location={campaign.location}
        units={campaign.units}
        status={campaign.status}
      />
    ));

  return (
    <div className="mt-2 mx-4 campaigns-list-wrapper">
      <h1>Donations</h1>
      <CampaignSearch onSearch={handleSearchChange} search={search} />
      <hr />
      <section
        style={{
          maxHeight: "calc(100dvh - 10em)",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
        className="campaigns-list-section"
      >
        <div className="d-flex flex-wrap gap-4 campaigns-list-container">
          {mappedCampaigns.length ? (
            mappedCampaigns
          ) : (
            <p>No campaigns founds.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CampaignsList;
