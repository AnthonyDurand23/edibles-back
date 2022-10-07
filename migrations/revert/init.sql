-- Revert edibles:init from pg

BEGIN;

DROP TABLE "stock_has_product", "product", "stock", "user";

COMMIT;
