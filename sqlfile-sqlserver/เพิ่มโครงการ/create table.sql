CREATE TABLE [stsbidding_user_staffs_roles] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [role_name] varchar(100) UNIQUE NOT NULL,
  [main_path] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_user_staffs_statuses] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [status_name] varchar(255)
)
GO

CREATE TABLE [stsbidding_user_staffs] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [email] varchar(255) UNIQUE NOT NULL,
  [password] varchar(255) NOT NULL,
  [first_name] varchar(255) NOT NULL,
  [last_name] varchar(255) NOT NULL,
  [user_staff_role] int NOT NULL,
  [job_position] int NOT NULL,
  [division] int NOT NULL,
  [department] int NOT NULL,
  [section] int NOT NULL,
  [is_active] bit,
  [user_staff_status] int
)
GO

CREATE TABLE [stsbidding_projects] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [key] varchar(20) UNIQUE,
  [name] varchar(500) NOT NULL,
  [Tor_uri] varchar(255) NOT NULL,
  [Job_description_uri] varchar(255) NOT NULL,
  [price] money,
  [calculate_uri] varchar(255),
  [is_active] char(1),
  [add_datetime] datetime NOT NULL,
  [adder_user_staff_id] int NOT NULL,
  [division] int NOT NULL,
  [department] int NOT NULL,
  [project_type] int NOT NULL,
  [job_type] int NOT NULL,
  [status_id] int NOT NULL
)
GO

CREATE TABLE [stsbidding_divisions] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [division_name] varchar(255) UNIQUE NOT NULL
)
GO

CREATE TABLE [stsbidding_projects_types] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [type_name] varchar(255) UNIQUE NOT NULL
)
GO

CREATE TABLE [stsbidding_departments] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [department_name] varchar(255) UNIQUE NOT NULL
)
GO

CREATE TABLE [stsbidding_projects_job_types] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [job_type_name] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_projects_statuses] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [status_name] varchar(255) UNIQUE NOT NULL
)
GO

CREATE TABLE [stsbidding_Manager_Roles] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] varchar(50)
)
GO

CREATE TABLE [stsbidding_Ref_price_Managers] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [user_staff_id] int,
  [project_id] int,
  [add_datetime] datetime NOT NULL,
  [manager_role_id] int
)
GO

CREATE TABLE [stsbidding_Budget_statuses] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [status_name] varchar(255) NOT NULL,
  [status_name_th] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_sub_budget_calculates] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [budget_calculate_id] int,
  [name] varchar(255) NOT NULL,
  [price] money NOT NULL
)
GO

CREATE TABLE [stsbidding_Budget_calculates] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [Ref_price_Manager_id] int,
  [Budget_status_id] int,
  [Budget] money NOT NULL,
  [calculate_file] nvarchar(255) NOT NULL,
  [submit_datetime] datetime NOT NULL
)
GO

CREATE TABLE [stsbidding_verify_calculates] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [Ref_price_Manager_id] int,
  [Budget_calculate_id] int,
  [verify] bit NOT NULL,
  [reason] varchar(255) NOT NULL,
  [comment] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_sub_budget_approveds] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [approve_calculate_id] int,
  [sub_budget_calculate_id] int,
  [new_price] money
)
GO

CREATE TABLE [stsbidding_approve_calculate] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [verify_calculate_id] int,
  [Ref_price_Managers_id] int,
  [approve] bit NOT NULL,
  [reason] varchar(255) NOT NULL,
  [comment] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_log_budget_calculates] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [log_action] varchar(255) NOT NULL,
  [action_datetime] datetime NOT NULL,
  [Ref_price_Manager_id] int,
  [project_id] int
)
GO

EXEC sp_addextendedproperty
@name = N'Table_Description',
@value = 'เราจะเพิ่มแถวโดยถ้าจะดึงอันล่าสุดมาจะใช้การเลือกอันที่ ID มากที่สุด โดยสามารถสร้างได้แค่ 3 กรณีคือ 
  1 ไม่เคยมี 
  2 เคยมีแต่อันล่าสุด Status = "reject by verify"
  3 เคยมีแต่อันล่าสุด status = "new calculate"',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'stsbidding_Budget_calculates';
GO

EXEC sp_addextendedproperty
@name = N'Table_Description',
@value = 'Verify จะต้องเลือกอันที่มาแสดงได้แค่ *Waiting_verify* เท่านั้น => 
update Status ที่ตาราง Budget_calculates ได้ 2 กรณี คือ 

  1. accept, 
  
  2. reject by verify',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'stsbidding_verify_calculates';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'the verifier only can be create and edit',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'stsbidding_verify_calculates',
@level2type = N'Column', @level2name = 'Ref_price_Manager_id';
GO

EXEC sp_addextendedproperty
@name = N'Table_Description',
@value = 'for approver 1 & 2 can access and editing',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'stsbidding_approve_calculate';
GO

ALTER TABLE [stsbidding_user_staffs] ADD FOREIGN KEY ([user_staff_role]) REFERENCES [stsbidding_user_staffs_roles] ([id])
GO

ALTER TABLE [stsbidding_user_staffs] ADD FOREIGN KEY ([user_staff_status]) REFERENCES [stsbidding_user_staffs_statuses] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([adder_user_staff_id]) REFERENCES [stsbidding_user_staffs] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([division]) REFERENCES [stsbidding_divisions] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([department]) REFERENCES [stsbidding_departments] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([project_type]) REFERENCES [stsbidding_projects_types] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([job_type]) REFERENCES [stsbidding_projects_job_types] ([id])
GO

ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([status_id]) REFERENCES [stsbidding_projects_statuses] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([user_staff_id]) REFERENCES [stsbidding_user_staffs] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([project_id]) REFERENCES [stsbidding_projects] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([manager_role_id]) REFERENCES [stsbidding_Manager_Roles] ([id])
GO

ALTER TABLE [stsbidding_sub_budget_calculates] ADD FOREIGN KEY ([budget_calculate_id]) REFERENCES [stsbidding_Budget_calculates] ([id])
GO

ALTER TABLE [stsbidding_Budget_calculates] ADD FOREIGN KEY ([Ref_price_Manager_id]) REFERENCES [stsbidding_Ref_price_Managers] ([id])
GO

ALTER TABLE [stsbidding_Budget_calculates] ADD FOREIGN KEY ([Budget_status_id]) REFERENCES [stsbidding_Budget_statuses] ([id])
GO

ALTER TABLE [stsbidding_verify_calculates] ADD FOREIGN KEY ([Ref_price_Manager_id]) REFERENCES [stsbidding_Ref_price_Managers] ([id])
GO

ALTER TABLE [stsbidding_verify_calculates] ADD FOREIGN KEY ([Budget_calculate_id]) REFERENCES [stsbidding_Budget_calculates] ([id])
GO

ALTER TABLE [stsbidding_sub_budget_approveds] ADD FOREIGN KEY ([approve_calculate_id]) REFERENCES [stsbidding_approve_calculate] ([id])
GO

ALTER TABLE [stsbidding_sub_budget_approveds] ADD FOREIGN KEY ([sub_budget_calculate_id]) REFERENCES [stsbidding_sub_budget_calculates] ([id])
GO

ALTER TABLE [stsbidding_approve_calculate] ADD FOREIGN KEY ([Ref_price_Managers_id]) REFERENCES [stsbidding_Ref_price_Managers] ([id])
GO

ALTER TABLE [stsbidding_approve_calculate] ADD FOREIGN KEY ([verify_calculate_id]) REFERENCES [stsbidding_verify_calculates] ([id])
GO

ALTER TABLE [stsbidding_log_budget_calculates] ADD FOREIGN KEY ([Ref_price_Manager_id]) REFERENCES [stsbidding_Ref_price_Managers] ([id])
GO

ALTER TABLE [stsbidding_log_budget_calculates] ADD FOREIGN KEY ([project_id]) REFERENCES [stsbidding_projects] ([id])
GO

ALTER TABLE [stsbidding_user_staffs] ADD FOREIGN KEY ([division]) REFERENCES [stsbidding_divisions] ([id])
GO

ALTER TABLE [stsbidding_user_staffs] ADD FOREIGN KEY ([department]) REFERENCES [stsbidding_departments] ([id])
GO
