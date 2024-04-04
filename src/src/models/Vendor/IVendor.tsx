export interface listvenderinterface{  
    vendor_key: number    
    company_name: string   
    email : string
    manager_name: string   
    phone_number: number   
    vendor_type: string 
    certificate_uri: string 
    vat_uri: string 
    bookbank_uri: string   
}  

export interface fileVenderInterface{    
    vendor_file: File 
    vendor_key: number   
} 

export interface listProjectForVendor{ 
    id:number 
    key: string  
    name: string
    submission_period: string  
    submit_datetime: string  
    submission_time:string
    Tor_uri: string 
    registers_status:string
    vendor_registers_id:number
    vendor_status : string
} 

export interface listVendorHistory{ 
    id:number
    key: string
    name: string
    division_name: string
    department_name : string
    SUBSECTION : string
    SECTION : string
    Tor_uri: string
    start_datetime : Date | string
    end_datetime : Date | string
    status_name_th : string
}
