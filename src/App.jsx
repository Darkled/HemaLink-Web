import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/ui/Dashboard";
import CampaignsList from "./components/ui/campaignsList/CampaignsList";
import YourCampaigns from "./components/ui/yourCampaigns/YourCampaigns";
import Donors from "./components/ui/donors/Donors";
import Entities from "./components/ui/entities/Entities";
import Moderators from "./components/ui/moderators/Moderators";
import NotFound from "./routes/notFound/NotFound";
import Protected from "./routes/protected/Protected";
import CancelAppointment from "./components/ui/cancelAppointment/CancelAppointment";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<CampaignsList />} />
            <Route element={<Protected />}>
              <Route path="/your-campaigns" element={<YourCampaigns />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/moderators" element={<Moderators />} />
            </Route>
          </Route>
          <Route path="/cancel/:bloodRequestId/:cancellationToken" element={<CancelAppointment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
