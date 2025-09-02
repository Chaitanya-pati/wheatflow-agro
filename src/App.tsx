import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import GateEntry from "./pages/GateEntry";
import QualityControl from "./pages/QualityControl";
import WeightManagement from "./pages/WeightManagement";
import GodownManagement from "./pages/GodownManagement";
import PreCleaning from "./pages/PreCleaning";
import ProductionOrders from "./pages/ProductionOrders";
import ProductionProcess from "./pages/ProductionProcess";
import FinishedGoods from "./pages/FinishedGoods";
import SalesOrders from "./pages/SalesOrders";
import Dispatch from "./pages/Dispatch";
import Reports from "./pages/Reports";
import Masters from "./pages/Masters";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gate-entry" element={<GateEntry />} />
            <Route path="/quality-control" element={<QualityControl />} />
            <Route path="/weight-management" element={<WeightManagement />} />
            <Route path="/godown-management" element={<GodownManagement />} />
            <Route path="/pre-cleaning" element={<PreCleaning />} />
            <Route path="/production-orders" element={<ProductionOrders />} />
            <Route path="/production-process" element={<ProductionProcess />} />
            <Route path="/finished-goods" element={<FinishedGoods />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/users" element={<Users />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
