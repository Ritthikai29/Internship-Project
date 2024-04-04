
export interface IBudgetLog {
    id?: number | string;
    log_action: string;
    action_datetime: string | Date
    Ref_price_Manager_id: number | string,
    employeeNO: string;
    nametitle_t: string;
    firstname_t: string;
    lastname_t: string;
    reject_result_id: number | null,
    reason_t: string | null,
    reason_e: string | null,
    reject_detail: string | null
}