export interface SubPriceInterface {
    id?: number;
    detail_price: string;
    price: number;
}
export interface ProjectInterface {
    id?: number;
    projectTypeId: number;
    projectJobTypeId: number;
    departmentId: number;
    divisionId: number;
    affiliationId: number;
    affiliationName: string;
    projectName: string;
    price: number;

    tor: File;
    jobDescription: File;
    calculateFile: File;

    // with sub price
    subPrice: SubPriceInterface[];

    // with manager
    calculator_id: string;
    verifier_id: string;
    verifier2_id: string;
    approver_id: string;
    approver2_id: string;
}

export interface status {
    id?: number;
    status_name: string;
}

export interface ResProjectInterface {
    id?: number;
    key: string;
    name: string;
    Job_description_uri: string;
    Tor_uri: string;
    project_type: number;
    job_type: number;
    department: number;
    division: number;
    add_datetime: string;
    status: status;
}


export interface RejectCalculateInterface {
    reason_id: number;
    comment: string;
    reason: ReasonInterface;
    err: string;
}

interface ReasonInterface {
    reason_t: string;
    reason_e: string
}

export interface IListProject {
    id?: number,
    key: string;
    name: string,
    Tor_uri: string,
    Job_description_uri: string,
    is_active: 1,
    add_datetime: string | Date,
    add_year: string,
    adder_user_staff_id: 5,
    start_datetime: string | Date,
    end_datetime: string | Date,
    status_id: 3,
    division_name: string,
    status_name: string,
    SECTION: string,
    SUBSECTION: string,
    department_name: string
}


export interface divisionInterface {
    id?: number;
    division_name: string;
}

interface departmentInterface {
    id?: number;
    department_name: string;
}

interface projectTypeInterface {
    id?: number;
    type_name: string;
}

interface sectionInterface {
    id?: number;
    SECTION: string;
    SUBSECTION: string;
}
export interface ProjectEditOwnerInterface {
    id?: number;
    key: string;
    name: string;
    Tor_uri: string;
    Job_description_uri: string;
    is_active: boolean;
    add_datetime: Date | string;
    adder_user_staff_id: number;
    division: divisionInterface;
    department: departmentInterface;
    section: sectionInterface;
    project_type: projectTypeInterface;
    status_id: number;
    status: any;
    division_id: number;
    department_id: number;
    section_id: number;
    project_type_id: number;
    job_type_id: number;
    tor: File | undefined;
    job_description: File | undefined;
}

export interface ReasonEditProjectInterface{
    project_id: number | string,
    reason: string,
    detial: string | null
}