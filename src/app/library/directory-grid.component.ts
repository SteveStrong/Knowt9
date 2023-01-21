import { Component, OnInit, OnDestroy, HostListener, Input } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";

import { GridOptions, Grid, GridApi, ColumnApi, Module } from 'ag-grid-community';

import { LegalCaseService } from "../models/legal-case.service";
import { LaCaseDirectoryItem, LaTeam } from "../models";

@Component({
  selector: 'app-directory-grid',
  templateUrl: './directory-grid.component.html',
  styleUrls: ['./directory-grid.component.scss']
})
export class DirectoryGridComponent implements OnInit {
  @Input() listFiles: Array<LaCaseDirectoryItem>;
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  
  rowData = [
  ];

  gridOptions: GridOptions = {
  }

  rowSelection = "multiple";
  defaultColumnDefs = {
    sortable: true,
    filter: true, 
    resizeable: true
  }
  
  columnDefs = [
    { headerName: 'workspace', field: 'workspace' },
    { headerName: 'file', field: 'fileName', checkboxSelection: true },
    { headerName: 'name', field: 'name' },
    { headerName: 'version', field: 'version' },
    { headerName: 'owner', field: 'owner' },
    { headerName: 'title', field: 'title' },
    { headerName: 'description', field: 'description' },
    { headerName: 'keywords', field: 'keywords' },
    { headerName: 'notes', field: 'notes' },
    { headerName: 'date', field: 'lastChange' },
  ];

  constructor(private lcService: LegalCaseService) { }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  composeDataSet(files: Array<LaCaseDirectoryItem>) {
    this.rowData = []
    files.forEach(item => {
        this.rowData.push(item)
    })
  }
  

  ngOnInit() {
    this.composeDataSet(this.listFiles)
    this.onRefreshDisplay();
  }

  onRefreshDisplay() {
  }

  onDownloadSelected() {
    const list = this.gridApi.getSelectedNodes();
    list.forEach(item => {
      let node: LaCaseDirectoryItem = item.data as LaCaseDirectoryItem;
      this.lcService.onDownloadFromServer(node);
      item.setSelected(false);
    })
}

  onSelectionChanged(e:Event) {
    let selectedRows = this.gridApi.getSelectedRows();
    let first = selectedRows[0]

   }

   doExport() {
    var params = {
      skipHeader: false,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: false,
      fileName: 'allfiles.csv',
      columnSeparator: ","
    };

    this.gridApi.exportDataAsCsv(params);
  }
}
