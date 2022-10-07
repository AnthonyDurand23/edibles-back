-- Deploy edibles:seeding to pg

BEGIN;


INSERT INTO "user" (email, password, firstname, lastname, expiration_date_notification, default_stock)
VALUES 
('cana.amr.50951@domy.me', '1234', 'cana', 'amr', 'true', 'frigo'),
('qhyelim.kim.9041s@txtp.site', '12342E2', 'lim', 'kim', false, 'placard'),
('jwazfaissalcalp@nonise.com', '13342E2', 'jwaz', 'faissal', true, 'stock3');

INSERT INTO stock (name, user_id)
VALUES
('Frigo', 1),
('placard', 2),
('stock3', 2);

COMMIT;
