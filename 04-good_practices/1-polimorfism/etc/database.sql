CREATE TABLE bonus (
    id CHAR(36) PRIMARY KEY,
    type ENUM('DAILY', 'FIRST_SEVEN_DAYS_STREAK', 'WELCOME') NOT NULL,
    reward ENUM('ONE_YEAR_FREE_SUBSCRIPTION', 'TEN_PERCENT_DISCOUNT', 'ONE_CODELIRA') NOT NULL
);

CREATE TABLE welcome_bonus (
    id CHAR(36) PRIMARY KEY,
    sticker VARCHAR(50) NOT NULL,
    FOREIGN KEY (id) REFERENCES bonus(id)
);