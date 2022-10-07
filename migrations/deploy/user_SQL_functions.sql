-- Deploy edibles:user_SQL_functions to pg

BEGIN;

CREATE FUNCTION new_user(json) RETURNS int AS $$
	INSERT INTO "user" (
        email, 
        password, 
        firstname, 
        lastname
    ) VALUES (
		$1->>'email',
		$1->>'password',
		$1->>'firstname',
		$1->>'lastname'
	) RETURNING id
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_user(json) RETURNS void AS $$
    UPDATE "user" SET 
        email=$1->>'email',
		password=COALESCE($1->>'password', password),
        firstname=$1->>'firstname',
        lastname=$1->>'lastname',
        expiration_date_notification=($1->>'expiration_date_notification')::boolean,
        default_stock=$1->>'default_stock'
        WHERE id=($1->>'id')::int;
$$ LANGUAGE SQL STRICT;

COMMIT;
