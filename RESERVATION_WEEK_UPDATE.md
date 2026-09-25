# Weekly reservation calendar update

The reservation page is now a simple full-week card calendar:

- Monday to Sunday week view
- Previous week / Today / Next week
- 30-minute slots only
- Morning: 08:00–12:00
- Afternoon: 14:00–16:00
- Reservation cards show candidate name, candidate ID, monitor, exam type and licence category
- Empty slots have an Add button
- Clicking a reservation opens Edit / Confirm / Cancel / Delete actions
- New and edited reservations enforce exactly 30 minutes and the allowed hours
- Existing Supabase realtime persistence remains in use for create/edit/cancel/delete updates
