-- Verify edibles:init on pg

BEGIN;

SELECT id FROM "user" WHERE false;
SELECT id FROM "stock" WHERE false;
SELECT id FROM "product" WHERE false;

ROLLBACK;
