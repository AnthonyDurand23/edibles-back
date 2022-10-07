-- Verify edibles:subscription_view on pg

BEGIN;

SELECT * FROM count_peremption_product_by_endpoint WHERE false;

ROLLBACK;
