import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridColDef, GridRowId, GridSelectionModel, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useActive } from "./main-page"
import "./tables-page.css"

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50, disableColumnMenu: true, sortable: false, },
    { field: 'firstName', headerName: 'First name', width: 130, disableColumnMenu: true, sortable: false, },
    { field: 'lastName', headerName: 'Last name', width: 130, disableColumnMenu: true, sortable: false, },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
        align: "left",
        headerAlign: "left",
        disableColumnMenu: true,
        sortable: false,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        disableColumnMenu: true,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        sortable: false,
    },
];

let rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
];

for (let i = 2; i < 50000; i++) {
    rows.push({ id: i, lastName: 'Харисон', firstName: 'Сергей', age: 65 })
}


const deleteStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: "#8C8C8C",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "10px",
    height: "80px",
    p: "10px 20px",
};

const deleteBtnStyle = {
    color: "white",
    backgroundColor: "#ca4230"
}

export default function TablesPage() {
    const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false)
    const [selected, setSelected] = useState<GridRowId[]>([])
    const { setActive } = useActive()
    useEffect(() => {
        setActive(1)
    }, [])

    const onRowSelectHandler = (m: GridSelectionModel) => {
        setSelected(m)
    }

    const onDeleteClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        const filteredRows = rows.filter(
            (item) => !selected.includes(item.id)
        )
        rows = filteredRows
        setDeleteModalOpened(false)
    }

    const rowsTxt = ["строка", "строки", "строк"]
    const cases = [2, 0, 1, 1, 1, 2]

    return (
        <div className="tables-page">
            <Modal
                onClose={() => setDeleteModalOpened(false)}
                open={deleteModalOpened}>
                <Box sx={deleteStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Выделен{selected.length === 1 ? "а" : "о"} {selected.length} {rowsTxt[(selected.length % 100 > 4 && selected.length % 100 < 20) ? 2 : cases[(selected.length % 10 < 5) ? selected.length % 10 : 5]]}
                    </Typography>
                    <div>
                        <Button onClick={onDeleteClickHandler} variant="outlined" className="deleteBtn" sx={deleteBtnStyle}>
                            Удалить
                        </Button>
                    </div>
                </Box>
            </Modal>
            <div className="table-header">
                <button className="btn add-btn">
                    Добавить
                </button>
                <div className="table-name-block">
                    <h2 className="table-name">Таблица: </h2>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            id="demo-simple-select-helper"
                            sx={{ fontSize: "16px", fontWeight: "500" }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <button onClick={() => setDeleteModalOpened(true)} disabled={selected.length < 1 ? true : false} className="btn delete-btn">
                    Удалить
                </button>
            </div>

            <div className="table">
                <DataGrid
                    selectionModel={selected}
                    rows={rows}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onSelectionModelChange={onRowSelectHandler}
                    autoHeight
                    columns={columns}
                    checkboxSelection
                    getRowHeight={() => 'auto'}
                />
            </div>
        </div>
    )
}