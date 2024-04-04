export interface VenderRegisterprojectinfoInterface {
    key?:String;
    
    price: string  ;
    AuctionPrice: string ;
    
    boq_uri: File ;
    receipt_uri:File ;
    Explaindetails:File ;
    
    subPrice: SubPriceInterface[] | undefined;

}

export interface VendorRegisterProjectInterface {
    key?:string;
    price: number | string ;
    conf_price: number | string;
    boq_uri: File ;
    receipt_uri:File ;
    Explaindetails:File ;
    subPrice: SubPriceInterface[] | undefined;
}

export interface SubPriceInterface {
    id?: Number;
    detail_price: string;
    price: number | string;
}