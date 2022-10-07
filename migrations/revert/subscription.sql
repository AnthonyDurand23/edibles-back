-- Revert edibles:subscription from pg

BEGIN;

DROP TABLE "subscription";

DROP FUNCTION new_subscription(json);

COMMIT;
