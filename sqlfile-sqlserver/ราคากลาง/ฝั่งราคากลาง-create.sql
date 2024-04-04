CREATE TABLE [stsbidding_projects] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [key] varchar(20) UNIQUE,
  [name] varchar(500) NOT NULL,
  [Tor_uri] varchar(255) NOT NULL,
  [Job_description_uri] varchar(255) NOT NULL,
  [add_datetime] datetime NOT NULL,
  [price] money,
  [status_id] int
)
GO

CREATE TABLE [stsbidding_project_statuses] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [status_name] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_Manager_Role] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] varchar(50)
)
GO

CREATE TABLE [stsbidding_user_staffs] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [email] varchar(255) UNIQUE NOT NULL,
  [password] varchar(255) NOT NULL,
  [f_name] varchar(255) NOT NULL,
  [s_name] varchar(255) NOT NULL,
  [user_staff_role] int
)
GO

CREATE TABLE [stsbidding_user_staff_role] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] varchar(255) NOT NULL
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
  [Ref_price_Managers_id] int,
  [verify_calculate_id] int,
  [approve] bit NOT NULL,
  [reason] varchar(255) NOT NULL,
  [comment] varchar(255) NOT NULL
)
GO

CREATE TABLE [stsbidding_log_budget_calculates] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [Ref_price_Manager_id] int,
  [log_action] varchar(255) NOT NULL,
  [action_datetime] datetime NOT NULL,
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
