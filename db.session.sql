CREATE TABLE submission (
    id SERIAL PRIMARY KEY,
    nomPrenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    formation VARCHAR(255) NOT NULL,
    motivation TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated BOOLEAN DEFAULT FALSE,
    validated_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE,
    deleted_by VARCHAR(255)
);

-- @block
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- @block
INSERT into admins (username, password) VALUES 
('yb_nader', '@nexus2005@'),
('tb_seif', '@nexus2005@'),
('bt_selena', '@nexus2005@'),
('bd_hadil', '@nexus2005@');
('gz_kamilia', '@nexus2005@');