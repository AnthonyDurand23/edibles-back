-- Deploy edibles:constraints to pg

BEGIN;

ALTER TABLE Stock 
    ADD CONSTRAINT Unique_constraint_stock UNIQUE (user_id,name);

CREATE DOMAIN email_regexp AS TEXT CHECK(
    VALUE ~ '^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$'
);


ALTER TABLE "user"
    ALTER COLUMN email TYPE email_regexp;

COMMIT;
