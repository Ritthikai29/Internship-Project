export interface projectsetting{
    project_id : number | undefined;
    datetime_start: number;
    datetime_end: number;    
    time_end: number;
    time_details: number
    date_details: number
    deposit_money: number;
    coordinator:string; 
    approver: string; 
    addiFile: File[];
    job_type: string;
}

interface ApproverInfo {
    id: string;
    employeeNO: string;
    nametitle_t: string;
    firstname_t: string;
    lastname_t: string;
    nametitle_e: string;
    firstname_e: string;
    lastname_e: string;
    section: string;
    department: string;
    position: string;
    email: string;
    mobile: string;
    isshift: null;
    emplevel: null;
    companyno: string;
    boss: string;
    phonework: string;
    phonehome: string;
    hotline: string;
    houseno: string;
    plgroup: string;
    function: string;
    idcard: string;
    nickname_th: string;
    subsection: string;
    division: string;
}

interface CoordinatorInfo {
    id: string;
    employeeNO: string;
    nametitle_t: string;
    firstname_t: string;
    lastname_t: string;
    nametitle_e: string;
    firstname_e: string;
    lastname_e: string;
    section: string;
    department: string;
    position: string;
    email: string;
    mobile: string;
    isshift: null;
    emplevel: null;
    companyno: string;
    boss: string;
    phonework: string;
    phonehome: string;
    hotline: string;
    houseno: string;
    plgroup: string;
    function: string;
    idcard: string;
    nickname_th: string;
    subsection: string;
    division: string;
}

export interface ProjectSettingInfo {
    id: string;
    start_datetime: string;
    end_datetime: string;
    deposit_money: string;
    approver_id: string;
    approve: string;
    detail_datetime: string;
    coordinator_id: string;
    project_id: string | null | undefined;
    creator_id: string;
    is_approver_send: string;
    file_uri: string;
    file_name: string;
    start_date: string;
    end_date: string;
    end_time: string;
    detail_date: string;
    detail_time: string;
    creator_name: string;
    approver_info: ApproverInfo;
    coordinator_info: CoordinatorInfo;
}
