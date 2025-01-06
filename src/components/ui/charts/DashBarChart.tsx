"use client";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}



type Props = {
    data: DataItem[]
}


const DashBarChart = ({ data }: Props) => {

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart
                width={500}
                height={300}    
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar  dataKey="pv" fill="#2E8B57" activeBar={<Rectangle fill="#2E8B57" stroke="#2E8B57" />} />
                <Bar dataKey="uv" fill="#a4a4a8" activeBar={<Rectangle fill="#a4a4a8" stroke="#a4a4a8" />} />
            </BarChart>
        </ResponsiveContainer >
    )
}

export default DashBarChart;