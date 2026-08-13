-- DOORS: record POPIA consent and the seller's introductory-viewing request
-- on every enquiry.
--
-- Client change list 11/08/2026, items A5 and A6 (Cindy Rodrigues): the
-- "Text me updates" tick box is removed from both pop-ups and replaced with an
-- explicit consent-to-contact tick box for POPIA purposes; the seller pop-up
-- also gains a "Request Introductory Viewing" tick box.
--
-- Consent is stored as the fact plus the moment it was given, because under
-- POPIA the defensible record is when the person agreed, not merely that a
-- boolean is true. Defaults are false: an enquiry that predates this column
-- must never be read as having consented.
--
-- Target: Chris's own Supabase project (DOORS, ref stgpdnxengnhsliqwavh).
-- Idempotent: safe to re-run.

alter table public.doors_enquiries
  add column if not exists contact_consent    boolean not null default false,
  add column if not exists consented_at       timestamptz,
  add column if not exists viewing_requested   boolean not null default false;

comment on column public.doors_enquiries.contact_consent is
  'POPIA: the person explicitly ticked consent to be contacted. Never defaulted true.';
comment on column public.doors_enquiries.consented_at is
  'When that consent was given. Null for rows captured before consent was recorded.';
comment on column public.doors_enquiries.viewing_requested is
  'Seller asked for an introductory viewing (Speak about Selling pop-up).';
