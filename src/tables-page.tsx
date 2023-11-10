import {Button, FormControl, MenuItem, Modal, Select, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {DataGrid, GridColDef, GridRowHeightParams, GridRowId, GridSelectionModel} from "@mui/x-data-grid"
import React, {useEffect, useState} from "react"
import {useActive} from "./main-page"
import "./tables-page.css"
import TextField from "@mui/material/TextField"
import Checkbox from '@mui/material/Checkbox';

import LoadingButton from '@mui/lab/LoadingButton';


import {api} from "./api";
import {create_dtos, dto_type} from "./dtos";


const deleteStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: "#575353",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "10px",
    p: "20px 20px",
};

const deleteBtnStyle = {
    color: "white",
    backgroundColor: "#ca4230"
}

const createBtnStyle = {
    color: "white",
    backgroundColor: "#279929FF",
    width: "100%",
    "margin-top": "10px",

}

export default function TablesPage() {
    const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false)
    const [createModalOpened, setCreateModalOpened] = useState<boolean>(false)
    const [columns, setColumns] = useState<GridColDef[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [error, setError] = useState<string>("");
    const [selected, setSelected] = useState<GridRowId[]>([])
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [creationState, setCreationState] = useState<{ [key: string]: any }>({})
    const [loading, setLoading] = useState<boolean>(false)
    const {setActive} = useActive()
    useEffect(() => {
        setActive(1)
    }, [])

    const generateColumns = (data: object) => {
        const t: GridColDef[] = [];
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
                t.push({
                    field: key,
                    headerName: key,
                    filterable: true
                })
            }
        }


        setColumns(t)
        setRows(r)
    }

    const generateCreateRows = () => {
        return create_dtos[selectedTable].data.reduce<JSX.Element[]>((accum, row) => {
            const label = <Typography variant="h6">{row.text}</Typography>;
            accum.push(label);
            const input = row.type !== dto_type.bool ? <TextField onChange={(event) => {
                    onChangeInput(event, row.attribute, row.type)
                }} disabled={loading} className="modal-input" required
                                                                  type={row.type === dto_type.number ? "number" : ""}/> :
                <Checkbox onChange={(event) => {
                    onChangeInput(event, row.attribute, row.type)
                }}/>
            accum.push(input);

            return accum
        }, []);
    }

    const onTableSelect = async (e: { target: { value: string; }; }) => {
        setLoading(true)
        const selectedTable: string = e.target.value;
        setSelectedTable(selectedTable)
        const response = await api.get(`${selectedTable}/`);
        generateColumns(response)
        setLoading(false)
    }

    const onRowSelectHandler = (m: GridSelectionModel) => {
        setSelected(m)
    }

    const onGenerateClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        try {
            await api.get("studios/generate/10000")
            await api.get("films/generate/10000")
            await api.get("cinemas/generate/10000")
            await api.get("sessions/generate/10000")
        } catch (error: any) {
            setError(error.toString())
        }
        setLoading(false)
    }

    const onDeleteClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        if (selected.length < 1) {
            setLoading(false)
            return;
        }

        const promises: Promise<any>[] = []

        for (const id of selected)
            promises.push(api.delete(`${selectedTable}/${id}`))

        try {
            await Promise.all(promises);
            setLoading(false)
            const response = await api.get(`${selectedTable}/`);
            generateColumns(response)
        } catch (error: any) {
            setError(error.toString())
        }
        setDeleteModalOpened(false)
        setLoading(false)
    }

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, attribute: string, type: dto_type) => {
        // const value = type === dto_type.number ? Number.parseInt(e.target.value) : e.target.value;
        let value: string | number | boolean;
        switch (type) {
            case dto_type.number:
                value = Number.parseInt(e.target.value)
                break;
            case dto_type.bool:
                // @ts-ignore
                value = Boolean(e.target.checked)
                break;
            default:
                value = e.target.value
                break;
        }
        setCreationState(prevState => ({
            ...prevState,
            [attribute]: value,
        }))
    }

    const closeCreationModal = () => {
        setCreationState({})
        setCreateModalOpened(false)
    }

    const onCreateClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        const attributes = create_dtos[selectedTable].data.map(d => d.attribute);
        for (const attribute of attributes) {
            if (!creationState[attribute]) {
                setLoading(false)
                alert("Не все поля заполнены!")
                return;
            }
        }
        try {
            const response1 = await api.post(`${selectedTable}/`, creationState)
            const response2 = await api.get(`${selectedTable}/`);
            generateColumns(response2)
            closeCreationModal()
        } catch (error: any) {
            alert(error)
        }
        setLoading(false)
    }


    const rowsTxt = ["строка", "строки", "строк"]
    const cases = [2, 0, 1, 1, 1, 2]

    // @ts-ignore
    return (
        <div className="tables-page">
            {error.length > 1 ? <div id={"error_field"}>{error}</div> : <></>}
            <Modal
                onClose={() => setDeleteModalOpened(false)}
                open={deleteModalOpened}>
                <Box sx={deleteStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Выделен{selected.length === 1 ? "а" : "о"} {selected.length} {rowsTxt[(selected.length % 100 > 4 && selected.length % 100 < 20) ? 2 : cases[(selected.length % 10 < 5) ? selected.length % 10 : 5]]}
                    </Typography>
                    <div>
                        <Button onClick={onDeleteClickHandler} variant="outlined" className="deleteBtn"
                                sx={deleteBtnStyle}>
                            Удалить
                        </Button>
                    </div>
                </Box>
            </Modal>
            {/*CREATE MODAL*/}
            <Modal
                onClose={closeCreationModal}
                open={createModalOpened}>
                <Box sx={deleteStyle}>
                    <Typography id="modal-modal-title" style={{marginBottom: "10px"}} variant="h6" component="h2">
                        Создать запись в
                        таблице <b>{selectedTable.length > 1 ? create_dtos[selectedTable].name : ""}</b>
                    </Typography>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {selectedTable.length > 1 ? generateCreateRows() : <></>}
                        <LoadingButton loading={loading} onClick={onCreateClickHandler} variant="outlined"
                                       className="createBtn"
                                       sx={createBtnStyle}>
                            Создать
                        </LoadingButton>
                    </div>
                </Box>
            </Modal>
            <div id="generate_button_div">
                <button onClick={onGenerateClickHandler} id="generate_button" disabled={loading}
                        className="btn add-btn">
                    Генерация
                </button>
            </div>
            <div className="table-header">
                <button onClick={() => setCreateModalOpened(true)} disabled={loading || selectedTable.length < 1}
                        className="btn add-btn">
                    Добавить
                </button>
                <div className="table-name-block">
                    <h2 className="table-name">Таблица: </h2>
                    <FormControl size="small" sx={{minWidth: 130}}>
                        <Select
                            displayEmpty
                            value={selectedTable}
                            inputProps={{'aria-label': 'Without label'}}
                            id="demo-simple-select-helper"
                            sx={{fontSize: "16px", fontWeight: "500"}}
                            onChange={onTableSelect}
                            disabled={loading}
                        >
                            <MenuItem value={"films"}>Фильмы</MenuItem>
                            <MenuItem value={"cinemas"}>Кинотеатры</MenuItem>
                            <MenuItem value={"sessions"}>Сеансы</MenuItem>
                            <MenuItem value={"directors"}>Режиссеры</MenuItem>
                            <MenuItem value={"qualities"}>Качество пленки</MenuItem>
                            <MenuItem value={"studios"}>Студии</MenuItem>
                            <MenuItem value={"session_types"}>Типы сеансов</MenuItem>
                            <MenuItem value={"cinema_types"}>Типы собственности</MenuItem>
                            <MenuItem value={"districts"}>Районы</MenuItem>
                            <MenuItem value={"countries"}>Страны</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <button onClick={() => setDeleteModalOpened(true)}
                        disabled={selected.length < 1 || loading}
                        className="btn delete-btn">
                    Удалить
                </button>
            </div>

            <div className="table">
                <DataGrid
                    loading={loading}
                    selectionModel={selected}
                    rows={rows}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onSelectionModelChange={onRowSelectHandler}
                    autoHeight
                    columns={columns}
                    checkboxSelection
                    getRowHeight={({id, densityFactor}: GridRowHeightParams) => {
                        return 80 * densityFactor

                    }}
                />
            </div>
        </div>
    )
}