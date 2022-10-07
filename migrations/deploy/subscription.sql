-- Deploy edibles:subscription to pg

BEGIN;

CREATE TABLE "subscription"( 
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "endpoint" TEXT NOT NULL UNIQUE,
    "keys_auth" TEXT NOT NULL,
    "keys_p256dh" TEXT NOT NULL,
    "user_id" INTEGER REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE FUNCTION new_subscription(json) RETURNS void AS $$
    INSERT INTO "subscription" (
        endpoint,
        keys_auth,
        keys_p256dh, 
        user_id
    ) VALUES (
        $1->>'endpoint',
        $1->>'keysAuth',
        $1->>'keysP256dh',
        ($1->>'userId')::int
    );
$$ LANGUAGE SQL STRICT;

COMMIT;
