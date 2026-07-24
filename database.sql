-- Azure SQL Database schema for Contact Submissions
-- Run this script against your Azure SQL Database before deploying the app.

CREATE TABLE ContactSubmissions (
    Id          INT             IDENTITY(1,1) PRIMARY KEY,
    FullName    NVARCHAR(100)   NOT NULL,
    Email       NVARCHAR(100)   NOT NULL,
    Subject     NVARCHAR(150)   NOT NULL,
    Message     NVARCHAR(MAX)   NOT NULL,
    SubmittedAt DATETIME        NOT NULL DEFAULT GETDATE()
);

-- Seed data: 2 sample contact submissions
INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
VALUES (
    N'Alex Rivera',
    N'alex.rivera@example.com',
    N'Network Infrastructure Consultation',
    N'Hi, I am interested in discussing VLAN segmentation for our office network. Please get in touch.'
);

INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
VALUES (
    N'Sam Chen',
    N'sam.chen@example.com',
    N'Azure Cloud Deployment Inquiry',
    N'We are migrating workloads to Azure and would like to learn more about your cloud hosting experience.'
);
