-- Revert edibles:constraints from pg

BEGIN;

ALTER TABLE "user"
    ALTER COLUMN email TYPE TEXT
    USING email::text;


DROP DOMAIN email_regexp;

ALTER TABLE stock 
    DROP CONSTRAINT Unique_constraint_stock;

COMMIT;
