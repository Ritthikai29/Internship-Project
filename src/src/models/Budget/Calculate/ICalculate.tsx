
export interface CalculateSubPriceInterface {
    id?: number;
    detail_price: string;
    price: number | string;
}

export interface CalculateInterface {
    id?: number;
    budget: number | string;
    pj_id: string;
    auction_file: File;
    sub_price?: CalculateSubPriceInterface[]

}

export interface EmployeeBudgetCalculate {
    id?: number;
    nametitle_t: string;
    firstname_t: string;
    lastname_t: string;
    employeeNO: string;
}

interface userRoleInterface {
    id: number;
    name: string;
    name_t: string;
}

export interface ManagerCalculator {
    id?: number | string ;
    employee: EmployeeBudgetCalculate;
    user_role: userRoleInterface;
}
