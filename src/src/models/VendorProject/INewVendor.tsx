export interface projectinterface {
    id?: number
    key: string
    name: string
    Tor_uri: string
    Job_description_uri: string
    calculate_uri: string
    is_active: number
    add_datetime: Date
    department_name: string
    division_name : string;
    SECTION : string;
    SUBSECTION : string;
    project_unit_price: string;
}

export interface projectsettinginterface{
    id?: number 
    startDate: Date | string
    endDate: Date | string
    depositMoney: string
    detailDate: Date
    firstN: string
    lastN: string
    email: string
    section: string
    department: string
    position: string
    nickname_th: string
}

export interface previousregisinterface{
    order: number
    regis_id: number
    regis_price: number
    regis_boq_uri: string
    regis_rec: string
    proj_id: number
}

export interface vendorinfointerface{
    id?: number
    vendor_key: string
    company_name: string
    add_datetime: Date
    email: string
    manager_name: string
    manager_role: string
    phone_number: string
    affiliated: string
    vendor_type: string
    location_detail: string
}

export interface vendornewregisinterface{
    key? : string
    price : number |  string
    conf_price: number | string
    boq_uri : File
    receipt_uri : File
    Explaindetails:File
    subPrice : subpriceinterface[] | undefined
}

export interface VendorNewRegisinterface {
    key?:String;
    
    price: string  ;
    AuctionPrice: string ;
    
    boq_uri: File ;
    receipt_uri:File ;
    Explaindetails:File ;
    
    subPrice: subpriceinterface[] | undefined;

}
export interface subpriceinterface{
    id?: Number
    detail_price : string
    price : number | string
}