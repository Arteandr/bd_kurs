import React, {useEffect, useState} from "react"
import {useActive} from "./main-page"
import './request-page.css'
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {requests} from "./dtos";
import {DataGrid, GridColDef, GridRowHeightParams} from "@mui/x-data-grid";
import XLSX from "xlsx";
import TextField from "@mui/material/TextField";
import {api} from "./api";
import {BarChart} from "@mui/x-charts";

export default function RequestPage() {
    const [loading, setLoading] = useState<boolean>(false)
    const [columns, setColumns] = useState<GridColDef[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [field, setField] = useState<string | number>("")
    const [chartData, setChartData] = useState<{}>({})
    const [chartDataset, setChartDataset] = useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<string>("");
    const {setActive} = useActive()
    useEffect(() => {
        setActive(2)
        getRequests()
    }, [])

    const onChangeRequest = (e: SelectChangeEvent) => {
        const value = e.target.value;
        setSelectedRequest(value)
        setField("")
        setChartData([])
    }

    const onChangeField = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = !Number.isNaN(Number(e.target.value)) ? Number(e.target.value) : e.target.value;
        setField(value);
    }

    const onExportClick = async () => {
        const filteredData = chartData.reduce((accum, row) => ({...accum, [row.label]: row.value}), {})
        const workSheet = XLSX.utils.json_to_sheet([filteredData])
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, workSheet, "Данные");
        XLSX.writeFile(workbook, "data.xlsx", {compression: true})
    }


    const generateColumns = (data: object) => {
        const c: GridColDef[] = [];
        const r: any[] = [];
        const hash: Map<string, any> = new Map<string, any>()
        for (let key in data) {
            // @ts-ignore
            const dataElement = data[key]
            // r.unshift(dataElement)
            r.push(dataElement)
            for (const [key, value] of Object.entries(dataElement)) {
                if (hash.has(key)) continue;
                hash.set(key, value)
                c.push({
                    minWidth: 200,
                    field: key,
                    headerName: key,
                    filterable: true
                })
            }
        }


        setColumns(c)
        setRows(r)
    }

    const onExecuteClick = async () => {
        if (selectedRequest.length < 1 || !requests[Number(selectedRequest)])
            return;

        const request = requests[Number(selectedRequest)];
        if (request.withField && !field) {
            alert(`Заполните поле «${request.fieldName}»`)
            return
        }

        setLoading(true)
        try {
            const response = await api.get(request.path + (request.withField ? `/${field}` : ""))
            generateColumns(response)
            console.log("response", response)
            const groups: any[] = [];
            const series: any[] = [];
            const dataset: any[] = [];
            if (request.withChart) {
                // const colors = ["#0088FF", "#00C49F", "#FFBB28"]
                const arr: any[] = [];
                // let i = 0;
                if (response instanceof Array)
                    response.forEach(r => {
                        const group = r["Качество пленки"];
                        groups.push(group)
                        const total = Number(r["Всего фильмов"]);
                        const moreDuration = Number(r["С длительностью больше часа"])
                        const after = Number(r["Созданные после 2012"])
                        series.push({data: [total, moreDuration, after]})
                        dataset.push({
                            total,
                            moreDuration,
                            after,
                            group
                        })
                    })

                const chart_data = {
                    xAxis: [{scaleType: 'band', data: groups}],
                    series
                }
                console.log(chart_data)
                // for (const [key, value] of Object.entries(response[0])) {
                //     arr.push({
                //         id: ++i,
                //         value: Number(value),
                //         label: key,
                //         color: colors.pop()
                //     })
                // }
                setChartData(chart_data)
                setChartDataset(dataset)
            }
        } catch (error: any) {
            console.error("ERROR: ", error);
        }

        setLoading(false)
    }

    const getRequests = () => {
        let nodes: JSX.Element[] = []
        for (const key in requests) {
            const request = requests[key];
            nodes.push(<MenuItem
                value={key}>[{Number(key) + 1}] {request.altName || request.name}</MenuItem>)
        }

        return nodes;
    }


    function generateRandom() {
        let length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <div className="requests-page">
            <div className="table-header requests-header">
                <FormControl className="request-header-select">
                    <InputLabel
                        id="req-label">{selectedRequest ? requests[Number(selectedRequest)].name : "Выберите запрос"}</InputLabel>
                    <Select
                        labelId="req-label"
                        id="demo-simple-select"
                        value={selectedRequest}
                        label={selectedRequest ? requests[Number(selectedRequest)].name : "Выберите запрос"}
                        onChange={onChangeRequest}
                    >
                        {getRequests()}
                    </Select>
                </FormControl>
                {selectedRequest.length > 0 && !Number.isNaN(Number(selectedRequest)) && requests[Number(selectedRequest)].withField ?
                    <TextField required onChange={onChangeField}
                               label={requests[Number(selectedRequest)].fieldName}></TextField> : <></>}
                <button onClick={onExecuteClick} className="btn add-btn" style={{color: "black"}}>Выполнить</button>
            </div>
            <div className="requests-table">
                <DataGrid
                    loading={loading}
                    rows={rows}
                    getRowId={(row: any) => generateRandom()}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    autoHeight
                    columns={columns}
                    checkboxSelection
                    getRowHeight={({id, densityFactor}: GridRowHeightParams) => {
                        return 80 * densityFactor
                    }}
                />
                {
                    chartDataset.length > 0 ?
                        <div style={{display: "flex", alignItems: "center"}}>
                            {/*<BarChart*/}
                            {/*    slotProps={{legend: {hidden: true}}}*/}
                            {/*    series={[*/}
                            {/*        {*/}
                            {/*            cornerRadius: 5,*/}
                            {/*            arcLabel: (item) => `${item.label}(${item.value})`,*/}
                            {/*            data: chartData,*/}
                            {/*        },*/}
                            {/*    ]}*/}
                            {/*    sx={{*/}
                            {/*        [`& .${pieArcLabelClasses.root}`]: {*/}
                            {/*            fill: "black",*/}
                            {/*            fontWeight: "bold",*/}
                            {/*            fontSize: "13px",*/}
                            {/*        },*/}
                            {/*    }} width={800}*/}
                            {/*    height={500}*/}
                            {/*/>*/}
                            {/*@ts-ignore*/}
                            <BarChart dataset={chartDataset} series={[
                                {dataKey: 'total', label: "Всего фильмов"},
                                {dataKey: 'moreDuration', label: "С длительностью больше часа"},
                                {dataKey: 'after', label: "Созданные после 2012"},
                            ]} xAxis={[{scaleType: "band", dataKey: "group"}]} width={800} height={500}/>
                            <button onClick={onExportClick} className="btn add-btn">Экспортировать в Excel</button>
                        </div>
                        : null
                }
            </div>
        </div>
    )
}