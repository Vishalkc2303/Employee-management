package com.poject.employee.Entity;


public enum WorkReportStatus {
    DRAFT,        // Saved but editable
    SUBMITTED,    // Submitted for review but not finalized
    FINALIZED,// Finalized by employee (no more edits)

    REJECTED,
    VERIFIED      // Verified by Manager
}
