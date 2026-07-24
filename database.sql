-- MySQL Database schema for Contact Submissions
-- Run this script against your MySQL Database (e.g., in Azure Query Editor or Workbench)

CREATE TABLE IF NOT EXISTS ContactSubmissions (
    Id          INT             AUTO_INCREMENT PRIMARY KEY,
    FullName    VARCHAR(100)    NOT NULL,
    Email       VARCHAR(100)    NOT NULL,
    Subject     VARCHAR(150)    NOT NULL,
    Message     TEXT            NOT NULL,
    SubmittedAt DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed data: 2 sample contact submissions
INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
VALUES (
    'Alex Rivera',
    'alex.rivera@example.com',
    'Network Infrastructure Consultation',
    'Hi, I am interested in discussing VLAN segmentation for our office network. Please get in touch.'
);

INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
VALUES (
    'Sam Chen',
    'sam.chen@example.com',
    'Azure Cloud Deployment Inquiry',
    'We are migrating workloads to Azure and would like to learn more about your cloud hosting experience.'
);
