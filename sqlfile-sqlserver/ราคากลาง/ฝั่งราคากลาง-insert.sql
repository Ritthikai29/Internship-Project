

INSERT INTO [dbo].[stsbidding_Budget_statuses] ([id],[status_name],[status_name_th]) VALUES (1,'Waiting Verify','รอการตรวจสอบ');
INSERT INTO [dbo].[stsbidding_Budget_statuses] ([id],[status_name],[status_name_th]) VALUES (2,'verified','การตรวจสอบได้รับการอนุมัติ');
INSERT INTO [dbo].[stsbidding_Budget_statuses] ([id],[status_name],[status_name_th]) VALUES (3,'reject by verify','ปฎิเสธการอนุมัติ ต้องแก้ไข'),(4,'approve 1','ได้รับการอนุมัติจากผู้อนุมัติ 1'),(5,'edit & approve 1','แก้ไขและอนุมัติจากผู้อนุมัติ 1'),(6,'reject 1','ปฎิเสธการอนุมัติ ต้องคำนวนราคากลางใหม่'),(7,'approve 2','ได้รับการอนุมัติจากผู้อนุมัติ 2'),(8,'reject 2','ปฎิเสธการอนุมัติ จากผู้อนุมัติ 2 ');




INSERT INTO [dbo].[stsbidding_Manager_Role] ([id],[name]) VALUES (1,'calculator');
INSERT INTO [dbo].[stsbidding_Manager_Role] ([id],[name]) VALUES (2,'verifier');
INSERT INTO [dbo].[stsbidding_Manager_Role] ([id],[name]) VALUES (3,'approver 1'),(4,'approver 2');


INSERT INTO [dbo].[stsbidding_project_statuses] ([id],[status_name]) VALUES (1,'calculating');
INSERT INTO [dbo].[stsbidding_project_statuses] ([id],[status_name]) VALUES (2,'calculated');
INSERT INTO [dbo].[stsbidding_project_statuses] ([id],[status_name]) VALUES (3,'successful');


INSERT INTO [dbo].[stsbidding_projects] ([id],[key],[name],[Tor_uri],[Job_description_uri],[add_datetime],[price],[status_id]) VALUES (1,'uts29s','Project A','tor.pdf','job-description.pdf','2565-01-01 00:00:00.000',NULL,1);


INSERT INTO [dbo].[stsbidding_Ref_price_Managers] ([id],[user_staff_id],[project_id],[add_datetime],[manager_role_id]) VALUES (2,1,1,'2565-01-01 00:00:00.000',1);


INSERT INTO [dbo].[stsbidding_user_staff_role] ([id],[name]) VALUES (1,'manager');
INSERT INTO [dbo].[stsbidding_user_staffs] ([id],[email],[password],[f_name],[s_name],[user_staff_role]) VALUES (1,'Tanachod@gmail.com','test1','Tanachod','Sakthamjaroen',1);


