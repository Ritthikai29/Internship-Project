export interface EmployeeInterface {
    id : number; 
    employeeNO : string;
    nametitle_t : string;
    firstname_t : string;
    lastname_t : string;
    nametitle_e : string;
    firstname_e : string;
    lastname_e : string;
    email: string;
    division: string;
    department: string;
    role_name_th:string;
    is_active:string;
    employee_id:string;
    subsection:string;
    section:string;
    position:string;
}

export interface BossEmployeeInterface {
    id?: number;
    employeeNO : string;
    firstname_t : string;
    lastname_t : string;
}

export interface ShowEmployeeInterface {
    calculator_id: EmployeeInterface;
    verifier_id: EmployeeInterface;
    verifier2_id: EmployeeInterface;
    approver_id: EmployeeInterface;
    approver2_id: EmployeeInterface;
}

