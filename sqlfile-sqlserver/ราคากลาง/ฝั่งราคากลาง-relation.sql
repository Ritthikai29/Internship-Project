
ALTER TABLE [stsbidding_projects] ADD FOREIGN KEY ([status_id]) REFERENCES [stsbidding_project_statuses] ([id])
GO

ALTER TABLE [stsbidding_user_staffs] ADD FOREIGN KEY ([user_staff_role]) REFERENCES [stsbidding_user_staff_role] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([user_staff_id]) REFERENCES [stsbidding_user_staffs] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([project_id]) REFERENCES [stsbidding_projects] ([id])
GO

ALTER TABLE [stsbidding_Ref_price_Managers] ADD FOREIGN KEY ([manager_role_id]) REFERENCES [stsbidding_Manager_Role] ([id])
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
