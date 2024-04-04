export interface BudgetInterface {
    id?: number,
    Budget: string
    status_name: string;
    submit_datetime: string | Date; //-> will convert to date
    calculate_file: string;
    sub_budgets: SubPriceInterface[]
}

interface SubPriceInterface {
    id?: number;
    budget_calculate_id: number;
    name: string;
    price: number | string
}



export interface SubmitBudgetInterface {
    project_key: string;
    reason_id?: number;
    comment?: string;
    is_verify: boolean
}

export interface SubmitBudget2Interface {
    project_key: string;
    reason_id?: number;
    comment?: string;
    is_verify_2: boolean
}

export interface VerifyReason {
    id: number;
    reason_t: string;
    reason_e: string;
}
