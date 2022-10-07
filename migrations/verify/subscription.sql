-- Verify edibles:subscription on pg

BEGIN;

SELECT id FROM "subscription" WHERE false;

ROLLBACK;
