"use client";
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface DataItem {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

type Props = {
    data: DataItem[]
}

const DashLineChart = ({ data }: Props) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                <Line type="monotone" dataKey="pv" stroke="#2E8B57" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#a4a4a8" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default DashLineChart;