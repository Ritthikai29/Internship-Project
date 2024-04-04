export interface RejectProjectValidateInterface {
    project_key: string;
    reject_id: string | number;
    comment: string;
}

export interface ProjectWaitInterface {
    id?: number;
    key: string;
    name: string;
    Tor_uri: string;
    Job_description_uri: string;
    is_active: string | boolean;
    add_datetime: string | Date;
    status_name: string;
    division_id: number;
    division_name: string;
    department_name:string 
    SECTION:string;
    SUBSECTION:string;
}


export interface ListTopicValidateProject {
    id?: number;
    reason: string;
}

export interface ListRetreatProject {
    id?: number;
    retreat_name: string;
}

export interface DetailProjectInterface{
    [x: string]: any;
    id?: number;
    key: string;
    name: string;
    price: number;
    calculate_uri: string;
    Tor_uri: string;
    division_name: string;
    Job_description_uri: string;
    add_datetime: string;
    status_name: string;
    subPrice: ISubPrice[]
    project_unit_price: string
    department_name:string 
    SECTION:string;
    SUBSECTION:string;
    job_type_name: string;
    type_name: string;
    section_name: string,
    subsection_name: string
    order?: number | string | null;
}

export interface ISubPrice {
    id?: string;
    project_id: string;
    detail: string;
    price: number
}

