CREATE TABLE submission (
    id INT auto_increment PRIMARY KEY,
    nomPrenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    formation VARCHAR(255) NOT NULL,
    motivation TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- @block
CREATE TABLE admins (
    id INT auto_increment PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)

-- @block
INSERT into admins (username, password) VALUES 
('yb_nader', '@nexus2005@'),
('tb_seif', '@nexus2005@'),
('bt_selena', '@nexus2005@');

-- @block
ALTER TABLE submission ADD COLUMN validated TINYINT(1) DEFAULT 0;
ALTER TABLE submission ADD COLUMN validated_by VARCHAR(255) DEFAULT NULL;
ALTER TABLE submission ADD COLUMN deleted TINYINT(1) DEFAULT 0;
ALTER TABLE submission ADD COLUMN deleted_by VARCHAR(255) DEFAULT NULL;
