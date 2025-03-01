USE pacific;

INSERT IGNORE INTO
    roles (name)
VALUES ('ADMIN'),
    ('STAFF'),
    ('VENDOR'),
    ('USER');

INSERT INTO
    users (
        username,
        email,
        password,
        role_id
    )
VALUES (
        "superadmin",
        "admin@pacific.com",
        "$2b$12$CiwXadSCtZR1VVDR4WK9heN5puDQudSDGWVyqrnR2o7E6r455JBdu",
        (
            SELECT id
            FROM roles
            WHERE
                name = "ADMIN"
        )
    );

