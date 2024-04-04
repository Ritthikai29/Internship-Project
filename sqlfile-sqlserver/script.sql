-- STSBidding.dbo.Employees definition

-- Drop table

-- DROP TABLE STSBidding.dbo.Employees;

CREATE TABLE Employees (
	id int IDENTITY(1,1) NOT NULL,
	employeeNO varchar(5) COLLATE Thai_CI_AS NOT NULL,
	nametitle_t varchar(10) COLLATE Thai_CI_AS NOT NULL,
	firstname_t varchar(255) COLLATE Thai_CI_AS NOT NULL,
	lastname_t varchar(255) COLLATE Thai_CI_AS NOT NULL,
	nametitle_e varchar(10) COLLATE Thai_CI_AS NOT NULL,
	firstname_e varchar(255) COLLATE Thai_CI_AS NOT NULL,
	lastname_e varchar(255) COLLATE Thai_CI_AS NOT NULL,
	[section] varchar(255) COLLATE Thai_CI_AS NULL,
	department varchar(255) COLLATE Thai_CI_AS NULL,
	[position] varchar(255) COLLATE Thai_CI_AS NULL,
	email varchar(50) COLLATE Thai_CI_AS NOT NULL,
	mobile varchar(10) COLLATE Thai_CI_AS NULL,
	isshift bit NULL,
	emplevel int NULL,
	companyno varchar(255) COLLATE Thai_CI_AS NULL,
	boss varchar(255) COLLATE Thai_CI_AS NULL,
	phonework varchar(10) COLLATE Thai_CI_AS NULL,
	phonehome varchar(255) COLLATE Thai_CI_AS NULL,
	hotline varchar(255) COLLATE Thai_CI_AS NULL,
	houseno varchar(255) COLLATE Thai_CI_AS NULL,
	plgroup varchar(255) COLLATE Thai_CI_AS NULL,
	[function] varchar(255) COLLATE Thai_CI_AS NULL,
	idcard varchar(30) COLLATE Thai_CI_AS NULL,
	nickname_th varchar(100) COLLATE Thai_CI_AS NULL,
	subsection varchar(255) COLLATE Thai_CI_AS NULL,
	division varchar(255) COLLATE Thai_CI_AS NULL,
	CONSTRAINT PK__Employee__3213E83FB372EDC2 PRIMARY KEY (id),
	CONSTRAINT UQ__Employee__C1323AE0F745E5E0 UNIQUE (employeeNO)
);


-- STSBidding.dbo.stsbidding_budget_statuses definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_budget_statuses;

CREATE TABLE stsbidding_budget_statuses (
	id int IDENTITY(1,1) NOT NULL,
	status_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	status_name_th varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F43AC3587 PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_departments definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_departments;

CREATE TABLE stsbidding_departments (
	id int IDENTITY(1,1) NOT NULL,
	department_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83FE34AF960 PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__226ED1573FE2C281 UNIQUE (department_name)
);


-- STSBidding.dbo.stsbidding_director_roles definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_director_roles;

CREATE TABLE stsbidding_director_roles (
	id int IDENTITY(1,1) NOT NULL,
	role_name varchar(100) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_director_roles_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_divisions definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_divisions;

CREATE TABLE stsbidding_divisions (
	id int IDENTITY(1,1) NOT NULL,
	division_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F92103D4D PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__500C0D5A5F480D94 UNIQUE (division_name)
);


-- STSBidding.dbo.stsbidding_generate_log definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_generate_log;

CREATE TABLE stsbidding_generate_log (
	id int IDENTITY(1,1) NOT NULL,
	errorFunc varchar(255) COLLATE Thai_CI_AS NULL,
	errorMsg varchar(255) COLLATE Thai_CI_AS NULL,
	errorDate datetime NULL,
	CONSTRAINT PK__stsbiddi__3213E83FCB3EE9AC PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_manager_roles definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_manager_roles;

CREATE TABLE stsbidding_manager_roles (
	id int IDENTITY(1,1) NOT NULL,
	name varchar(50) COLLATE Thai_CI_AS NULL,
	CONSTRAINT PK__stsbiddi__3213E83F62034421 PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_open_bidding definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_open_bidding;

CREATE TABLE stsbidding_open_bidding (
	id int IDENTITY(1,1) NOT NULL,
	open_datetime datetime NOT NULL,
	open_place varchar(100) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_open_bidding_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_projects_job_types definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_projects_job_types;

CREATE TABLE stsbidding_projects_job_types (
	id int IDENTITY(1,1) NOT NULL,
	job_type_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83FF10F6829 PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_projects_statuses definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_projects_statuses;

CREATE TABLE stsbidding_projects_statuses (
	id int IDENTITY(1,1) NOT NULL,
	status_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F51BDE242 PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__501B37535470449E UNIQUE (status_name)
);


-- STSBidding.dbo.stsbidding_projects_types definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_projects_types;

CREATE TABLE stsbidding_projects_types (
	id int IDENTITY(1,1) NOT NULL,
	type_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F2F1C38C4 PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__543C4FD9C7DD4901 UNIQUE (type_name)
);


-- STSBidding.dbo.stsbidding_reason_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reason_calculates;

CREATE TABLE stsbidding_reason_calculates (
	reason_e varchar(255) COLLATE Thai_CI_AS NULL,
	reason_t varchar(255) COLLATE Thai_CI_AS NULL,
	id int IDENTITY(1,1) NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F05105A99 PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__04FBFA7DBE63E9C1 UNIQUE (reason_e)
);


-- STSBidding.dbo.stsbidding_reject_reason_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_reason_projects;

CREATE TABLE stsbidding_reject_reason_projects (
	id int IDENTITY(1,1) NOT NULL,
	reason varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_reject_reason_projects_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_reject_topic_project_settings definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_topic_project_settings;

CREATE TABLE stsbidding_reject_topic_project_settings (
	id int IDENTITY(1,1) NOT NULL,
	reject_topic varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_reject_topic_project_settings_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_reject_topic_vendor_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_topic_vendor_projects;

CREATE TABLE stsbidding_reject_topic_vendor_projects (
	id int IDENTITY(1,1) NOT NULL,
	reject_topic varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_reject_topic_vendor_projects_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_user_staffs_roles definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_user_staffs_roles;

CREATE TABLE stsbidding_user_staffs_roles (
	id int IDENTITY(1,1) NOT NULL,
	role_name varchar(100) COLLATE Thai_CI_AS NOT NULL,
	main_path varchar(255) COLLATE Thai_CI_AS NULL,
	CONSTRAINT PK__stsbiddi__3213E83F6F888FC6 PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__783254B14FB9F44B UNIQUE (role_name)
);


-- STSBidding.dbo.stsbidding_user_staffs_statuses definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_user_staffs_statuses;

CREATE TABLE stsbidding_user_staffs_statuses (
	id int IDENTITY(1,1) NOT NULL,
	status_name varchar(255) COLLATE Thai_CI_AS NULL,
	CONSTRAINT PK__stsbiddi__3213E83FED7128F7 PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_vendor_job_types definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_job_types;

CREATE TABLE stsbidding_vendor_job_types (
	id int IDENTITY(1,1) NOT NULL,
	job_type_name varchar(100) COLLATE Thai_CI_AS NOT NULL,
	job_type_general_name varchar(100) COLLATE Thai_CI_AS NULL,
	CONSTRAINT stsbidding_vendor_job_type_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_vendor_location_main definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_location_main;

CREATE TABLE stsbidding_vendor_location_main (
	id int IDENTITY(1,1) NOT NULL,
	sub_district varchar(100) COLLATE Thai_CI_AS NOT NULL,
	district varchar(100) COLLATE Thai_CI_AS NOT NULL,
	province varchar(100) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_vendor_location_main_PK PRIMARY KEY (id)
);


-- STSBidding.dbo.stsbidding_reject_vendor_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_vendor_projects;

CREATE TABLE stsbidding_reject_vendor_projects (
	id int IDENTITY(1,1) NOT NULL,
	reject_topic_id int NOT NULL,
	reject_detail varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_reject_vendor_projects_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_reject_vendor_projects_FK_reject_topic FOREIGN KEY (reject_topic_id) REFERENCES stsbidding_reject_topic_vendor_projects(id)
);


-- STSBidding.dbo.stsbidding_user_staffs definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_user_staffs;

CREATE TABLE stsbidding_user_staffs (
	id int IDENTITY(1,1) NOT NULL,
	password varchar(255) COLLATE Thai_CI_AS NOT NULL,
	user_staff_role int NOT NULL,
	is_active bit NULL,
	user_staff_status int NULL,
	employee_id int NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F8EEA2A67 PRIMARY KEY (id),
	CONSTRAINT stsbidding_user_staffs_UN UNIQUE (employee_id),
	CONSTRAINT FK__stsbiddin__emplo__07C12930 FOREIGN KEY (employee_id) REFERENCES Employees(id),
	CONSTRAINT FK__stsbiddin__user___4BAC3F29 FOREIGN KEY (user_staff_role) REFERENCES stsbidding_user_staffs_roles(id),
	CONSTRAINT FK__stsbiddin__user___4CA06362 FOREIGN KEY (user_staff_status) REFERENCES stsbidding_user_staffs_statuses(id)
);


-- STSBidding.dbo.stsbidding_vendors definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendors;

CREATE TABLE stsbidding_vendors (
	id int IDENTITY(1,1) NOT NULL,
	vendor_key varchar(255) COLLATE Thai_CI_AS NOT NULL,
	password varchar(255) COLLATE Thai_CI_AS NULL,
	company_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	add_datetime datetime NOT NULL,
	email varchar(100) COLLATE Thai_CI_AS NOT NULL,
	manager_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	manager_role varchar(255) COLLATE Thai_CI_AS NULL,
	phone_number varchar(10) COLLATE Thai_CI_AS NOT NULL,
	affiliated varchar(100) COLLATE Thai_CI_AS NOT NULL,
	vendor_type varchar(255) COLLATE Thai_CI_AS NOT NULL,
	location_detail varchar(255) COLLATE Thai_CI_AS NOT NULL,
	note varchar(255) COLLATE Thai_CI_AS NULL,
	vendor_level varchar(1) COLLATE Thai_CI_AS NULL,
	location_main_id int NULL,
	CONSTRAINT stsbidding_vendors_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_vendors_UN_vendor_key UNIQUE (vendor_key),
	CONSTRAINT stsbidding_vendors_FK FOREIGN KEY (location_main_id) REFERENCES stsbidding_vendor_location_main(id)
);


-- STSBidding.dbo.stsbidding_approve_vendor_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_approve_vendor_projects;

CREATE TABLE stsbidding_approve_vendor_projects (
	id int IDENTITY(1,1) NOT NULL,
	reject1_id int NULL,
	reject2_id int NULL,
	approver1_id int NOT NULL,
	approver2_id int NOT NULL,
	approve1 bit NULL,
	approve2 bit NULL,
	reason_to_approve varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_approve_vendor_projects_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_approve_vendor_projects_FK_approver1 FOREIGN KEY (approver1_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_approve_vendor_projects_FK_approver2 FOREIGN KEY (approver2_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_approve_vendor_projects_FK_reject1 FOREIGN KEY (reject1_id) REFERENCES stsbidding_reject_vendor_projects(id),
	CONSTRAINT stsbidding_approve_vendor_projects_FK_reject2 FOREIGN KEY (reject2_id) REFERENCES stsbidding_reject_vendor_projects(id)
);


-- STSBidding.dbo.stsbidding_director definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_director;

CREATE TABLE stsbidding_director (
	id int IDENTITY(1,1) NOT NULL,
	director_staff_id int NOT NULL,
	open_id int NOT NULL,
	director_role_id int NOT NULL,
	CONSTRAINT stsbidding_director_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_director_FK FOREIGN KEY (director_staff_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_director_roles_FK_1 FOREIGN KEY (director_role_id) REFERENCES stsbidding_director_roles(id),
	CONSTRAINT stsbidding_open_FK FOREIGN KEY (open_id) REFERENCES stsbidding_open_bidding(id)
);


-- STSBidding.dbo.stsbidding_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_projects;

CREATE TABLE stsbidding_projects (
	id int IDENTITY(1,1) NOT NULL,
	[key] varchar(20) COLLATE Thai_CI_AS NULL,
	name varchar(500) COLLATE Thai_CI_AS NOT NULL,
	Tor_uri varchar(255) COLLATE Thai_CI_AS NOT NULL,
	Job_description_uri varchar(255) COLLATE Thai_CI_AS NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NULL,
	calculate_uri varchar(255) COLLATE Thai_CI_AS NULL,
	is_active char(1) COLLATE Thai_CI_AS NULL,
	add_datetime datetime NOT NULL,
	adder_user_staff_id int NOT NULL,
	division int NOT NULL,
	department int NOT NULL,
	project_type int NOT NULL,
	job_type int NOT NULL,
	status_id int NOT NULL,
	opendate_id int NULL,
	CONSTRAINT PK__stsbiddi__3213E83F23F2E6DF PRIMARY KEY (id),
	CONSTRAINT UQ__stsbiddi__DFD83CAF2B6FFBF1 UNIQUE ([key]),
	CONSTRAINT FK__stsbiddin__depar__4F7CD00D FOREIGN KEY (department) REFERENCES stsbidding_departments(id),
	CONSTRAINT FK__stsbiddin__divis__4E88ABD4 FOREIGN KEY (division) REFERENCES stsbidding_divisions(id),
	CONSTRAINT FK__stsbiddin__job_t__5165187F FOREIGN KEY (job_type) REFERENCES stsbidding_projects_job_types(id),
	CONSTRAINT FK__stsbiddin__proje__5070F446 FOREIGN KEY (project_type) REFERENCES stsbidding_projects_types(id),
	CONSTRAINT FK__stsbiddin__statu__52593CB8 FOREIGN KEY (status_id) REFERENCES stsbidding_projects_statuses(id),
	CONSTRAINT stsbidding_openbidding_FK FOREIGN KEY (opendate_id) REFERENCES stsbidding_open_bidding(id),
	CONSTRAINT stsbidding_projects_FK FOREIGN KEY (adder_user_staff_id) REFERENCES stsbidding_user_staffs(id)
);


-- STSBidding.dbo.stsbidding_projects_sub_budget definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_projects_sub_budget;

CREATE TABLE stsbidding_projects_sub_budget (
	id int IDENTITY(1,1) NOT NULL,
	project_id int NULL,
	detail varchar(255) COLLATE Thai_CI_AS NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F4C98E105 PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__proje__01142BA1 FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id)
);


-- STSBidding.dbo.stsbidding_ref_price_managers definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_ref_price_managers;

CREATE TABLE stsbidding_ref_price_managers (
	id int IDENTITY(1,1) NOT NULL,
	user_staff_id int NULL,
	project_id int NULL,
	add_datetime datetime NOT NULL,
	manager_role_id int NULL,
	CONSTRAINT PK__stsbiddi__3213E83F14B27486 PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__manag__5535A963 FOREIGN KEY (manager_role_id) REFERENCES stsbidding_manager_roles(id),
	CONSTRAINT FK__stsbiddin__proje__5441852A FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id),
	CONSTRAINT FK__stsbiddin__user___534D60F1 FOREIGN KEY (user_staff_id) REFERENCES stsbidding_user_staffs(id)
);


-- STSBidding.dbo.stsbidding_validate_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_validate_projects;

CREATE TABLE stsbidding_validate_projects (
	id int IDENTITY(1,1) NOT NULL,
	project_id int NOT NULL,
	user_validator_id int NOT NULL,
	approve bit NOT NULL,
	CONSTRAINT stsbidding_validate_projects_PK PRIMARY KEY (id),
	CONSTRAINT project_FK FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id),
	CONSTRAINT user_validator_FK FOREIGN KEY (user_validator_id) REFERENCES stsbidding_user_staffs(id)
);


-- STSBidding.dbo.stsbidding_vendor_has_job_type definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_has_job_type;

CREATE TABLE stsbidding_vendor_has_job_type (
	vendor_id int NOT NULL,
	id int IDENTITY(1,1) NOT NULL,
	job_type_id int NOT NULL,
	CONSTRAINT stsbidding_vendor_is_job_type_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_vendor_has_job_type_FK_job_types FOREIGN KEY (job_type_id) REFERENCES stsbidding_vendor_job_types(id),
	CONSTRAINT stsbidding_vendor_is_job_type_FK_vendor FOREIGN KEY (vendor_id) REFERENCES stsbidding_vendors(id)
);


-- STSBidding.dbo.stsbidding_vendor_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_projects;

CREATE TABLE stsbidding_vendor_projects (
	id int IDENTITY(1,1) NOT NULL,
	project_id int NOT NULL,
	vendor_id int NOT NULL,
	passcode varchar(255) COLLATE Thai_CI_AS NULL,
	approve bit NULL,
	adder_user_staff_id int NOT NULL,
	CONSTRAINT stsbidding_vendor_projects_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_vendor_projects_FK FOREIGN KEY (vendor_id) REFERENCES stsbidding_vendors(id),
	CONSTRAINT stsbidding_vendor_projects_FK_adder_user_staff FOREIGN KEY (adder_user_staff_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_vendor_projects_FK_project FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id)
);


-- STSBidding.dbo.stsbidding_vendor_registers definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_registers;

CREATE TABLE stsbidding_vendor_registers (
	id int IDENTITY(1,1) NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NOT NULL,
	boq_uri varchar(255) COLLATE Thai_CI_AS NOT NULL,
	receipt_uri varchar(255) COLLATE Thai_CI_AS NOT NULL,
	[order] int NOT NULL,
	submit_datetime datetime NOT NULL,
	vendor_project_id int NOT NULL,
	CONSTRAINT stsbidding_vendor_registers_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_vendor_registers_FK FOREIGN KEY (vendor_project_id) REFERENCES stsbidding_vendor_projects(id)
);


-- STSBidding.dbo.stsbidding_budget_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_budget_calculates;

CREATE TABLE stsbidding_budget_calculates (
	id int IDENTITY(1,1) NOT NULL,
	Ref_price_Manager_id int NULL,
	Budget_status_id int NULL,
	Budget varchar(255) COLLATE Thai_CI_AS NOT NULL,
	calculate_file nvarchar(255) COLLATE Thai_CI_AS NOT NULL,
	submit_datetime datetime NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F6C83AC81 PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__Budge__5812160E FOREIGN KEY (Budget_status_id) REFERENCES stsbidding_budget_statuses(id),
	CONSTRAINT FK__stsbiddin__Ref_p__571DF1D5 FOREIGN KEY (Ref_price_Manager_id) REFERENCES stsbidding_ref_price_managers(id)
);


-- STSBidding.dbo.stsbidding_log_budget_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_log_budget_calculates;

CREATE TABLE stsbidding_log_budget_calculates (
	id int IDENTITY(1,1) NOT NULL,
	log_action varchar(255) COLLATE Thai_CI_AS NOT NULL,
	action_datetime datetime NOT NULL,
	Ref_price_Manager_id int NULL,
	project_id int NULL,
	CONSTRAINT PK__stsbiddi__3213E83FE75BB102 PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__Ref_p__5EBF139D FOREIGN KEY (Ref_price_Manager_id) REFERENCES stsbidding_ref_price_managers(id),
	CONSTRAINT FK__stsbiddin__proje__5FB337D6 FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id)
);


-- STSBidding.dbo.stsbidding_project_settings definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_project_settings;

CREATE TABLE stsbidding_project_settings (
	id int IDENTITY(1,1) NOT NULL,
	start_datetime datetime NOT NULL,
	end_datetime datetime NOT NULL,
	deposit_money money NOT NULL,
	approver_id int NOT NULL,
	approve bit NULL,
	detail_datetime datetime NULL,
	coordinator_id int NULL,
	project_id int NOT NULL,
	creator_id int NOT NULL,
	is_approver_send bit NULL,
	CONSTRAINT stsbidding_project_settings_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_project_settings_UN_project UNIQUE (project_id),
	CONSTRAINT stsbidding_project_settings_FK FOREIGN KEY (creator_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_project_settings_FK_approver FOREIGN KEY (approver_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_project_settings_FK_coordinator FOREIGN KEY (coordinator_id) REFERENCES stsbidding_user_staffs(id),
	CONSTRAINT stsbidding_project_settings_FK_project FOREIGN KEY (project_id) REFERENCES stsbidding_projects(id)
);


-- STSBidding.dbo.stsbidding_reject_project_settings definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_project_settings;

CREATE TABLE stsbidding_reject_project_settings (
	id int IDENTITY(1,1) NOT NULL,
	reject_topic_id int NOT NULL,
	reject_detail varchar(255) COLLATE Thai_CI_AS NULL,
	project_setting_id int NOT NULL,
	CONSTRAINT stsbidding_reject_project_settings_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_reject_project_settings_FK FOREIGN KEY (project_setting_id) REFERENCES stsbidding_project_settings(id),
	CONSTRAINT stsbidding_reject_project_settings_FK_reject_topic FOREIGN KEY (reject_topic_id) REFERENCES stsbidding_reject_topic_project_settings(id)
);


-- STSBidding.dbo.stsbidding_reject_validate_projects definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_reject_validate_projects;

CREATE TABLE stsbidding_reject_validate_projects (
	id int IDENTITY(1,1) NOT NULL,
	validate_id int NOT NULL,
	reject_reason_id int NOT NULL,
	reject_comment varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_reject_validate_projects_UN UNIQUE (validate_id),
	CONSTRAINT validate_projects_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_reject_reason_projects_FK FOREIGN KEY (reject_reason_id) REFERENCES stsbidding_reject_reason_projects(id),
	CONSTRAINT stsbidding_reject_validate_projects_FK FOREIGN KEY (validate_id) REFERENCES stsbidding_validate_projects(id)
);


-- STSBidding.dbo.stsbidding_sub_budget_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_sub_budget_calculates;

CREATE TABLE stsbidding_sub_budget_calculates (
	id int IDENTITY(1,1) NOT NULL,
	budget_calculate_id int NULL,
	name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83FB0B535DE PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__budge__5629CD9C FOREIGN KEY (budget_calculate_id) REFERENCES stsbidding_budget_calculates(id)
);


-- STSBidding.dbo.stsbidding_sub_price_register definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_sub_price_register;

CREATE TABLE stsbidding_sub_price_register (
	id int IDENTITY(1,1) NOT NULL,
	name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NOT NULL,
	vendor_register_id int NOT NULL,
	CONSTRAINT stsbidding_sub_price_register_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_sub_price_register_FK FOREIGN KEY (vendor_register_id) REFERENCES stsbidding_vendor_registers(id)
);


-- STSBidding.dbo.stsbidding_vendor_project_has_approve_vendor_project definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_vendor_project_has_approve_vendor_project;

CREATE TABLE stsbidding_vendor_project_has_approve_vendor_project (
	id int IDENTITY(1,1) NOT NULL,
	approve_vendor_project_id int NOT NULL,
	vendor_project_id int NOT NULL,
	CONSTRAINT stsbidding_vendor_project_has_approve_vendor_project_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_vendor_project_has_approve_vendor_project_FK FOREIGN KEY (vendor_project_id) REFERENCES stsbidding_vendor_projects(id),
	CONSTRAINT stsbidding_vendor_project_has_approve_vendor_project_FK_1 FOREIGN KEY (approve_vendor_project_id) REFERENCES stsbidding_approve_vendor_projects(id)
);


-- STSBidding.dbo.stsbidding_verify_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_verify_calculates;

CREATE TABLE stsbidding_verify_calculates (
	id int IDENTITY(1,1) NOT NULL,
	Ref_price_Manager_id int NULL,
	Budget_calculate_id int NULL,
	verify bit NOT NULL,
	reason_id int NULL,
	comment varchar(255) COLLATE Thai_CI_AS NULL,
	submit_datetime datetime NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F4EFA791A PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__Budge__59FA5E80 FOREIGN KEY (Budget_calculate_id) REFERENCES stsbidding_budget_calculates(id),
	CONSTRAINT FK__stsbiddin__Ref_p__59063A47 FOREIGN KEY (Ref_price_Manager_id) REFERENCES stsbidding_ref_price_managers(id),
	CONSTRAINT stsbidding_verify_calculates_FK FOREIGN KEY (reason_id) REFERENCES stsbidding_reason_calculates(id)
);


-- STSBidding.dbo.stsbidding_approve_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_approve_calculates;

CREATE TABLE stsbidding_approve_calculates (
	id int IDENTITY(1,1) NOT NULL,
	verify_calculate_id int NULL,
	Ref_price_Managers_id int NULL,
	approve bit NOT NULL,
	price varchar(255) COLLATE Thai_CI_AS NULL,
	submit_datetime datetime NOT NULL,
	is_edit bit NULL,
	CONSTRAINT PK__stsbiddi__3213E83F6C2E7CDB PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__Ref_p__5CD6CB2B FOREIGN KEY (Ref_price_Managers_id) REFERENCES stsbidding_ref_price_managers(id),
	CONSTRAINT FK__stsbiddin__verif__5DCAEF64 FOREIGN KEY (verify_calculate_id) REFERENCES stsbidding_verify_calculates(id)
);


-- STSBidding.dbo.stsbidding_approve_reject_calculates definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_approve_reject_calculates;

CREATE TABLE stsbidding_approve_reject_calculates (
	id int IDENTITY(1,1) NOT NULL,
	approve_id int NULL,
	reason_id int NULL,
	comment varchar(255) COLLATE Thai_CI_AS NULL,
	calculate_again bit NULL,
	CONSTRAINT PK__stsbiddi__3213E83F707B035F PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__appro__114A936A FOREIGN KEY (approve_id) REFERENCES stsbidding_approve_calculates(id),
	CONSTRAINT stsbidding_approve_reject_calculates_FK FOREIGN KEY (reason_id) REFERENCES stsbidding_reason_calculates(id)
);


-- STSBidding.dbo.stsbidding_project_setting_files definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_project_setting_files;

CREATE TABLE stsbidding_project_setting_files (
	id int IDENTITY(1,1) NOT NULL,
	file_uri varchar(255) COLLATE Thai_CI_AS NOT NULL,
	project_setting_id int NOT NULL,
	file_name varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT stsbidding_project_setting_files_PK PRIMARY KEY (id),
	CONSTRAINT stsbidding_project_setting_files_FK FOREIGN KEY (project_setting_id) REFERENCES stsbidding_project_settings(id)
);


-- STSBidding.dbo.stsbidding_sub_budget_approveds definition

-- Drop table

-- DROP TABLE STSBidding.dbo.stsbidding_sub_budget_approveds;

CREATE TABLE stsbidding_sub_budget_approveds (
	id int IDENTITY(1,1) NOT NULL,
	approve_calculate_id int NULL,
	price varchar(255) COLLATE Thai_CI_AS NULL,
	detail varchar(255) COLLATE Thai_CI_AS NOT NULL,
	CONSTRAINT PK__stsbiddi__3213E83F226898A0 PRIMARY KEY (id),
	CONSTRAINT FK__stsbiddin__appro__5AEE82B9 FOREIGN KEY (approve_calculate_id) REFERENCES stsbidding_approve_calculates(id)
);