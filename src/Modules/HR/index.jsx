import React from "react";
import { Routes, Route } from "react-router-dom";
import Hr_Dashboard from "./pages/Hr_Dashboard"; // Ensure correct path
import LeavePage from "./pages/LeavePage"; // Adjust the import path if necessary
import CPDA_ADVANCE from "./pages/CPDA_ADVANCE";
import LTC from "./pages/LTC";
import Appraisal from "./pages/Appraisel";
import CPDA_Claim from "./pages/CPDA_Claim";
import FormView from "./pages/FormView";
import CPDA_ADVANCEView from "./pages/CPDA_ADVANCEPageComp/CPDA_ADVANCEView";
import LeaveFormView from "./pages/LeavePageComp/LeaveFormView";
import LeaveFilehandle from "./pages/LeavePageComp/Leave_file_handle";
import Cpda_advFilehandle from "./pages/CPDA_ADVANCEPageComp/Cpda_ADVANCE_file_handle";
import LTCFilehandle from "./pages/LTCPageComp/LTC_file_handle";

import LTCFormView from "./pages/LTCPageComp/LTCFormView";
import CPDA_ClaimFormView from "./pages/CPDA_ClaimPageComp/CPDA_ClaimFormView";
import CPDA_ClaimFilehandle from "./pages/CPDA_ClaimPageComp/CPDA_Claim_file_handle";

import { MantineProvider } from "@mantine/core"; // Import MantineProvider

export default function HR() {
  return (
    <Routes>
      {/* Show welcome message at /hr */}
      <Route path="/" element={<LeavePage />} />
      {/* Render LeavePage at /hr/leave */}
      <Route path="leave/file_handler/:id" element={<LeaveFilehandle />} />
      <Route path="leave/view/:id" element={<LeaveFormView />} />
      <Route path="leave/*" element={<LeavePage />} />

      {/* Route for the CPDA Advance View page */}
      <Route
        path="cpda_adv/file_handler/:id"
        element={<Cpda_advFilehandle />}
      />
      <Route path="cpda_adv/view/:id" element={<CPDA_ADVANCEView />} />
      <Route path="cpda_adv/*" element={<CPDA_ADVANCE />} />

      <Route path="ltc/*" element={<LTC />} />
      <Route path="ltc/view/:id" element={<LTCFormView />} />
      <Route path="ltc/view/:id" element={<LTCFormView />} />
      <Route path="ltc/file_handler/:id" element={<LTCFilehandle />} />

      <Route path="appraisal/*" element={<Appraisal />} />

      <Route path="cpda_claim/*" element={<CPDA_Claim />} />
      <Route path="cpda_claim/view/:id" element={<CPDA_ClaimFormView />} />
      <Route
        path="cpda_claim/file_handler/:id"
        element={<CPDA_ClaimFilehandle />}
      />

      <Route path="FormView/*" element={<FormView />} />
    </Routes>
    // </MantineProvider>
  );
}
