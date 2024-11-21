import { host } from "../globalRoutes";

export const search_employee = `${host}/hr2/api/search_employee`;
export const get_my_details = `${host}/hr2/api/get_my_details`;
export const get_form_track = (formId) =>
  `${host}/hr2/api/get_track_file/${formId}`;
export const get_form_id = `${host}/hr2/api/get_form_id`;
// Leave routes
export const get_leave_requests = `${host}/hr2/api/get_leave_requests`;
export const get_leave_inbox = `${host}/hr2/api/get_leave_inbox`;
export const get_leave_archive = `${host}/hr2/api/get_leave_archive`;
export const get_leave_balance = `${host}/hr2/api/get_leave_balance`;
export const submit_leave_form = `${host}/hr2/api/submit_leave_form`;
export const view_leave_form = `${host}/hr2/api/view_leave_form_data`;
export const leave_edit_handle = `${host}/hr2/api/leave_edit_handle`;
export const leave_file_handle = `${host}/hr2/api/leave_file_handle`;

// LTC routes
export const get_ltc_requests = `${host}/hr2/api/get_ltc_requests`;
export const get_ltc_inbox = `${host}/hr2/api/get_ltc_inbox`;
export const get_ltc_archive = `${host}/hr2/api/get_ltc_archive`;
export const submit_ltc_form = `${host}/hr2/api/submit_ltc_form`;
export const view_ltc_form = `${host}/hr2/api/view_ltc_form_data`;
export const ltc_edit_handle = `${host}/hr2/api/ltc_edit_handle`;
export const ltc_file_handle = `${host}/hr2/api/ltc_file_handle`;

// CPDA Advance routes
export const get_cpda_adv_requests = `${host}/hr2/api/get_cpda_adv_requests`;
export const get_cpda_adv_inbox = `${host}/hr2/api/get_cpda_adv_inbox`;
export const get_cpda_adv_archive = `${host}/hr2/api/get_cpda_adv_archive`;
export const submit_cpda_adv_form = `${host}/hr2/api/submit_cpda_adv_form`;
export const view_cpda_adv_form = `${host}/hr2/api/view_cpda_adv_form_data`;
export const cpda_adv_edit_handle = `${host}/hr2/api/cpda_adv_edit_handle`;
export const cpda_adv_file_handle = `${host}/hr2/api/cpda_adv_file_handle`;

// CPDA Claim routes
export const get_cpda_claim_requests = `${host}/hr2/api/get_cpda_claim_requests`;
export const get_cpda_claim_inbox = `${host}/hr2/api/get_cpda_claim_inbox`;
export const get_cpda_claim_archive = `${host}/hr2/api/get_cpda_claim_archive`;
export const submit_cpda_claim_form = `${host}/hr2/api/submit_cpda_claim_form`;
export const view_cpda_claim_form = `${host}/hr2/api/view_cpda_claim_form_data`;
export const cpda_claim_edit_handle = `${host}/hr2/api/cpda_claim_edit_handle`;
export const cpda_claim_file_handle = `${host}/hr2/api/cpda_claim_file_handle`;

// Appraisal routes
export const get_appraisal_requests = `${host}/hr2/api/get_appraisal_requests`;
export const get_appraisal_inbox = `${host}/hr2/api/get_appraisal_inbox`;
export const get_appraisal_archive = `${host}/hr2/api/get_appraisal_archive`;
