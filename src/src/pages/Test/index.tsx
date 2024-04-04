import React, { useEffect, useState } from 'react';

function TestPing() {

    const [count, setCount] = useState(0);

    

    const getUpdate = async () => {
        setCount((prev) => (prev + 1))
    }

    useEffect(() => {
        const requestInterval = setInterval(getUpdate, 1000);

        return () => {
            clearInterval(requestInterval)
        }
    }, []);

    const [datetime, setDatetime] = useState<
    {
        date: string, 
        time: string
    }
    >({
        date: "",
        time: ""
    });
    const handleDatetime = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        if(e.target.name === "startDate"){
            setDatetime({
                ...datetime,
                date: e.target.value,
            })
        }else{
            setDatetime({
                ...datetime,
                time: e.target.value,
            })
        }
        let date = new Date(datetime.date + " " + datetime.time);
        console.log(date.toJSON())
        console.log(datetime.date + " " + datetime.time)
    }

    return (
        <div>
            <p>Listening for server pings... {count}</p>
            <input
                type='date'
                name="startDate"
                onChange={handleDatetime}
            />
            <input
                type='time'
                name='startTime'
                onChange={handleDatetime}
            />
        </div>
    );
}

export default TestPing;
