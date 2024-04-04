import React, {useState } from "react"
import { ProjectInterface } from "../models/Project/IProject";

 function  Priceavgfile(){
    const [isHaveSubprice, setIsHaveSubprice] = useState<boolean>();
    const [project, setProject] = useState<Partial<ProjectInterface>>({});
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof project;
    
        if (event.target.files) {
            setProject({
                ...project,
                [name]: event.target.files[0],
            });
        }
    };
    
    const [price, setPrice] = useState<string>("");
    const handleNumberChange = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof project;
        let price: string = e.target.value;

        let text = price.replace(/,/gi, "");
        const deciPrice = parseFloat(text);
        setProject({
            ...project,
            [name]: deciPrice,
        });

        let lastCharIsAdot = text.substring(text.length - 1) === ".";
        if (lastCharIsAdot) {
            setPrice(deciPrice.toLocaleString("en-US") + ".");
        } else {
            if (price === "") {
                setPrice("");
            } else {
                setPrice(deciPrice.toLocaleString("en-US"));
            }
        }
        
    };

    return(
        <div className="lg:mb-4">
                                <label className=" text-gray-700 text-sm">
                                    ไฟล์ราคากลาง
                                </label>
                                <input
                                    className="border rounded w-full py-2 px-3 text-gray-700 focus:shadow-outline"
                                    id="budget-price-file"
                                    type="file"
                                    placeholder="ราคากลาง"
                                    name="calculateFile"
                                    onChange={handleFileChange}
                                />
                                
                                
                                <label className=" text-gray-700 text-sm">
                                    ราคากลาง
                                </label>
                                <input
                                    className="border rounded w-full py-2 px-3 text-gray-700 focus:shadow-outline"
                                    id="budget-price"
                                    type="text"
                                    placeholder="ราคากลาง"
                                    name="price"
                                    value={price}
                                    onChange={handleNumberChange}
                                />
                                
                                <div>
                                <label>มีราคากลางย่อยหรือไม่</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="is-have"
                                        id="is-have"
                                        onClick={() => {
                                            setIsHaveSubprice(true);
                                        }}
                                    />
                                    <label>มีราคากลางย่อย</label>
                                    <input
                                        type="radio"
                                        name="is-have"
                                        id="is-haven't"
                                        onClick={() => {
                                            setIsHaveSubprice(false);
                                        }}
                                    />
                                    <label>ไม่มีราคากลางย่อย</label>
                                </div>

                            </div>






                            </div>


    );
}

export default Priceavgfile;
