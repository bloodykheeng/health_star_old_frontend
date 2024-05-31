import React, { useEffect, useState, forwardRef, useMemo, useRef, useCallback, memo } from 'react';
import MaterialTable from '@material-table/core';
// import MaterialTable from "material-table";
// import { FileEarmarkBarGraphFill, Trash } from "react-bootstrap-icons";

// import { Checkbox, Select, MenuItem } from "@material-ui/core";
import { Checkbox, Select, MenuItem } from '@mui/material';
import AddBox from '@mui/icons-material/AddBox';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clear from '@mui/icons-material/Clear';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import FilterList from '@mui/icons-material/FilterList';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Remove from '@mui/icons-material/Remove';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Search from '@mui/icons-material/Search';
import ViewColumn from '@mui/icons-material/ViewColumn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import ApprovalIcon from '@mui/icons-material/Approval';
import CancelIcon from '@mui/icons-material/Cancel';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import RefreshIcon from '@mui/icons-material/Refresh';

import AddCircleIcon from '@mui/icons-material/AddCircle';
/* eslint-disable react/display-name */
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ServerSideMuiTable = ({
  showTextRowsSelected,
  showSelectAllCheckbox,
  exportButton,
  pdfExportTitle,
  csvExportTitle,
  selection,
  selectionChange,
  showDataApproval,
  handleDataApproval,
  hideDataApprovalRow,
  showRejectionAction,
  handleRejectionAction,
  hideRejectionActionRow,
  tableData,
  tableTitle,
  tableColumns,
  handleShowEditForm,
  handleViewPage,
  handleDelete,
  showEdit,
  showViewPage,
  showDelete,
  loading = false,
  excelexporting,
  downloadExcel,
  hideRowEdit,
  hideRowViewPage,
  hideRowDelete,
  handleViewPdf,
  hideViewPdfRow,
  showViewPdf,

  //pagination
  handleMaterialTableQueryPromise = async () => {},
  current_page,
  totalCount,
  setTableQueryObject = () => {}
}) => {
  //
  const tableRef = useRef();
  const memorisedTableData = useMemo(() => {
    return tableData;
  }, [tableData]);

  const tableDataRef = useRef();
  tableDataRef.current = memorisedTableData;

  console.log('is dfdasdsfs tableRef.current : ', tableRef.current);

  const loadingRef = useRef();
  loadingRef.current = loading;

  const [currentQuery, setQuery] = useState({});
  console.log('🚀 ~ currentQuery:', currentQuery);

  const [mTableActions, setMTableActions] = useState([]);

  useEffect(() => {}, []);
  console.log('mTableActions : ', mTableActions);

  const [filter, setFilter] = useState(false);
  const handleMaterialTableCheckboxChange = () => {
    setFilter(!filter);
  };

  useEffect(() => {
    tableDataRef.current = memorisedTableData;
  }, [memorisedTableData]);

  // Effect to handle when memorisedTableData changes
  useEffect(() => {
    if (tableRef.current && !loading) {
      const { page, totalCount, ...filteredQuery } = currentQuery;
      // tableRef.current.onQueryChange(filteredQuery);
      tableRef.current.onQueryChange(currentQuery);
    }
  }, [memorisedTableData]);

  // let handleShowRowEdit = (rowData) => {
  //   if (typeof showRowEdit === "function") {
  //   } else {
  //     console.log("The function prop is not a function.");
  //   }
  // };

  //==================== view Page Action ====================
  const createConditionalHideViewPageIconAction = (rowData) => {
    let viewPageAction = showViewPage && {
      icon: () => <VisibilityIcon style={{ color: '#1976d2' }} />,
      tooltip: 'View Page',
      onClick: (e, data) => handleViewPage(data),
      isFreeAction: false,
      hidden: typeof hideRowViewPage === 'function' ? hideRowViewPage(rowData) : false
    };

    if (viewPageAction) {
      return viewPageAction;
    }
  };

  const createConditionalHideViewReportPdfPdfIconAction = (rowData) => {
    // console.log('edditing action : ', editingAction)

    let viewReportPdfAction = showViewPdf && {
      icon: () => <PictureAsPdfIcon style={{ color: 'orange' }} />,
      tooltip: 'view report',
      onClick: (e, data) => handleViewPdf(e, data),
      isFreeAction: false,
      hidden: typeof hideViewPdfRow === 'function' ? hideViewPdfRow(rowData) : false
    };

    if (viewReportPdfAction) {
      return viewReportPdfAction;
    }
  };

  const createConditionalHideEditIconAction = (rowData) => {
    let editingAction = showEdit && {
      icon: () => <Edit style={{ color: 'green' }} />,
      tooltip: 'edit',
      onClick: (e, data) => handleShowEditForm(data),
      isFreeAction: false,
      hidden: typeof hideRowEdit === 'function' ? hideRowEdit(rowData) : false
    };

    if (editingAction) {
      return editingAction;
    }

    // setMTableActions([
    //   editingAction && editingAction,
    //   deletingAction && deletingAction
    // ]);
  };

  const createConditionalHideDeleteIconAction = (rowData) => {
    // console.log('edditing action : ', editingAction)

    let deletingAction = showDelete && {
      icon: () => <DeleteOutline style={{ color: 'red' }} />,
      tooltip: 'delete',
      onClick: (e, data) => handleDelete(e, data.id),
      isFreeAction: false,
      hidden: typeof hideRowDelete === 'function' ? hideRowDelete(rowData) : false
    };

    if (deletingAction) {
      return deletingAction;
    }
  };

  //======== Data Approval ==================
  const createConditionalhideDataApprovalIconAction = (rowData) => {
    // console.log('edditing action : ', editingAction)

    let viewDataApproval = showDataApproval && {
      icon: () => (
        <ApprovalIcon
          style={{ color: '56E39F', fontWeight: 'bold', cursor: 'pointer' }} // Bolder icon
        />
      ),
      tooltip: 'Approve',
      onClick: (e, data) => handleDataApproval(e, data),
      isFreeAction: false,
      hidden: typeof hideDataApprovalRow === 'function' ? hideDataApprovalRow(rowData) : false
    };

    if (viewDataApproval) {
      return viewDataApproval;
    }
  };

  //======== Cancel Data Approval ==================
  const createConditionalhideRejectionAction = (rowData) => {
    // console.log('edditing action : ', editingAction)

    let viewRejectionAction = showRejectionAction && {
      icon: () => <DisabledByDefaultIcon style={{ color: 'red', cursor: 'pointer' }} />,
      tooltip: 'Reject',
      onClick: (e, data) => handleRejectionAction(e, data),
      isFreeAction: false,
      hidden: typeof hideRejectionActionRow === 'function' ? hideRejectionActionRow(rowData) : false
    };

    if (viewRejectionAction) {
      return viewRejectionAction;
    }
  };

  let tableOptions = {
    // debounceInterval: 700,
    padding: 'dense',
    selection: selection,
    showSelectAllCheckbox: showSelectAllCheckbox,
    showTextRowsSelected: showTextRowsSelected,
    cellStyle: {
      paddingLeft: '1rem', // Adjust the padding value as needed
      paddingRight: '1rem',
      paddingBottom: '0.5px', // Adjust the padding value as needed
      paddingTop: '0.5px'
    },
    doubleHorizontalScroll: true,
    filtering: filter,
    sorting: false,
    search: true,
    searchFieldAlignment: 'right',
    paging: true,
    pageSizeOptions: [1, 5, 15, 30, 50, 75, 100],
    pageSize: 5,
    paginationPosition: 'bottom',
    exportAllData: true,
    exportFileNme: 'Sub Project Lists',
    actionsColumnIndex: -1,
    columnsButton: true,
    rowStyle: (data, index) => ({
      padding: '1rem',
      background: index % 2 === 0 ? 'transparent' : 'transparent', // Normal background color
      '&:hover': {
        backgroundColor: '#dee2e6' // Change this color to the desired hover background color
      }
    }),
    headerStyle: {
      // padding: "1rem",
      paddingBottom: '1rem',
      whiteSpace: 'nowrap',
      background: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      fontSize: '1rem',
      color: 'black',
      '&:hover': {
        background: '#efefef'
      }
    }
  };

  // Conditionally add export options
  if (exportButton) {
    tableOptions = {
      ...tableOptions,
      exportButton: exportButton,
      exportMenu: [
        {
          label: 'Export PDF',
          exportFunc: (cols, datas) => ExportPdf(cols, datas, pdfExportTitle ?? 'pdfData')
        },
        {
          label: 'Export CSV',
          exportFunc: (cols, datas) => ExportCsv(cols, datas, csvExportTitle ?? 'CsvData')
        }
      ]
    };
  }

  return (
    <div>
      <MaterialTable
        tableRef={tableRef}
        icons={tableIcons}
        isLoading={loading}
        columns={tableColumns}
        onSelectionChange={(rows) => typeof selectionChange === 'function' && selectionChange(rows)}
        data={async (query) => {
          // setTableQueryObject(query);
          setQuery(query);

          //make sure this returns something
          await handleMaterialTableQueryPromise(query);

          let finalres = await new Promise((resolve, reject) => {
            let intervalId;

            if (loadingRef.current) {
              console.log('Timeout reached, starting interval checks');
              const intervalId = setInterval(() => {
                if (!loadingRef.current) {
                  console.log('yah ive resolved with time interval');
                  console.log('Loading finished, resolving promise');
                  resolve({
                    data: tableDataRef.current?.data,
                    page: tableDataRef.current?.current_page - 1, // Adjust to 0-indexed page
                    totalCount: tableDataRef.current?.total
                  });
                  clearInterval(intervalId);
                }
              }, 100); // Check every 1 millisecond
            }

            const timeoutId = setTimeout(() => {
              clearInterval(intervalId);
            }, 120000); // 2 minutes in milliseconds

            // prepare your data and then call resolve like this:
            if (!loadingRef.current) {
              console.log('yah ive resolved with !loadingRef.current ', tableDataRef.current?.data);
              resolve({
                // data: tableDataRef.current ?? [],
                data: tableDataRef.current?.data,
                page: tableDataRef.current?.current_page - 1, // Adjust to 0-indexed page
                totalCount: tableDataRef.current?.total
              });
              clearTimeout(timeoutId); // Clear the timeout if resolved before timeout
            }
          });

          return new Promise((resolve, reject) => {
            resolve(finalres);
          });
        }}
        title={tableTitle}
        options={tableOptions}
        actions={[
          {
            icon: () => <RefreshIcon />,
            tooltip: 'refresh',
            isFreeAction: true,
            onClick: () => {
              if (tableRef.current) {
                setTimeout(() => {
                  tableRef.current.onQueryChange(currentQuery);
                }, 300);
              }
            }
          },
          // {
          //   icon: () => (
          //     <Checkbox
          //       color="primary"
          //       checked={filter}
          //       onChange={handleMaterialTableCheckboxChange}
          //       inputProps={{ 'aria-label': 'primary checkbox' }}
          //     />
          //   ),
          //   tooltip: 'Hide/Show Filter option',
          //   isFreeAction: true
          // },
          excelexporting && {
            icon: () => <FileDownloadIcon />, // you can pass icon too
            tooltip: 'Export to Excel',
            onClick: () => downloadExcel(),
            isFreeAction: true
          },
          // typeof handleDataApproval === "function" && {
          //     icon: () => (
          //         <CheckCircleIcon
          //             style={{ color: "56E39F", fontWeight: "bold" }} // Bolder icon
          //         />
          //     ), // Approval icon
          //     tooltip: "Approve",
          //     onClick: () => {
          //         handleDataApproval();
          //     },
          // },
          showRejectionAction && ((rowData) => createConditionalhideRejectionAction(rowData)),
          showDataApproval && ((rowData) => createConditionalhideDataApprovalIconAction(rowData)),
          showViewPage && ((rowData) => createConditionalHideViewPageIconAction(rowData)),
          showViewPdf && ((rowData) => createConditionalHideViewReportPdfPdfIconAction(rowData)),
          showEdit && ((rowData) => createConditionalHideEditIconAction(rowData)),
          showDelete && ((rowData) => createConditionalHideDeleteIconAction(rowData))
        ]}
      />
    </div>
  );
};

export default memo(ServerSideMuiTable);
