import { Routes, Route } from "react-router-dom";

// Pages
import IntegrationsHub from "./index";
import AddAccountGallery from "./AddAccountGallery";
import PlatformDetailPage from "./PlatformDetailPage";
import ConnectWizard from "./ConnectWizard";
import ConnectSuccessPage from "./ConnectSuccessPage";
import AccountDetailPage from "./AccountDetailPage";
import ReconcilePage from "./ReconcilePage";
import SyncLogsPage from "./SyncLogsPage";
import DeveloperPage from "./DeveloperPage";
import CreateApiKeyPage from "./CreateApiKeyPage";
import CreateWebhookPage from "./CreateWebhookPage";

export const IntegrationRoutes = () => (
  <Routes>
    <Route index element={<IntegrationsHub />} />
    <Route path="add" element={<AddAccountGallery />} />
    <Route path="add/:category" element={<AddAccountGallery />} />
    <Route path=":id" element={<PlatformDetailPage />} />
    <Route path=":id/connect" element={<ConnectWizard />} />
    <Route path=":id/connected" element={<ConnectSuccessPage />} />
    <Route path=":id/detail" element={<AccountDetailPage />} />
    <Route path=":id/reconcile" element={<ReconcilePage />} />
    <Route path=":id/logs" element={<SyncLogsPage />} />
    <Route path="logs" element={<SyncLogsPage />} />
    <Route path="developer" element={<DeveloperPage />} />
    <Route path="developer/keys/new" element={<CreateApiKeyPage />} />
    <Route path="developer/webhooks/new" element={<CreateWebhookPage />} />
  </Routes>
);

export default IntegrationRoutes;
