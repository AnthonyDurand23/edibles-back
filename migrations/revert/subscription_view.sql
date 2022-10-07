-- Revert edibles:subscription_view from pg

BEGIN;

DROP VIEW count_peremption_product_by_endpoint;

COMMIT;
