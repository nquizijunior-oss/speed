# SpeedPermis — Reservation module update

Updated the reservations module to match the existing SpeedPermis application visual language: Inter typography, the existing brand palette, spacing, borders, controls, cards and button hierarchy.

## Functional changes
- Full date navigation, including dates outside the current week.
- Search by candidate, candidate ID/NEPH, vehicle, monitor and reservation type.
- Monitor filter with live slot recalculation.
- Session slot availability and vacancy calculation.
- Quick assignment from a vacant slot, with the selected date/time pre-filled.
- New reservations support arbitrary dates and times instead of a fixed time-slot list.
- Reservation conflict validation for both candidate and monitor.
- Confirm, release/cancel, restore and permanent delete actions.
- Reservation editing for date, start/end time, monitor and status.
- Printing from the reservation drawer.
- Realtime connection state displayed in the module.
- Supabase shared-state/realtime mechanism retained.

## Verification note
The source files were checked for balanced TypeScript/TSX delimiters. A complete TypeScript/build verification could not be completed in this environment because the project's dependency installation did not finish and the working copy has no installed `node_modules` tree.
