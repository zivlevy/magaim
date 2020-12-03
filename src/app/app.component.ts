import {Component} from '@angular/core';
import {ButtonRendererComponent} from './button-renderer/button-renderer.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MagaFormComponent} from './maga-form/maga-form.component';
import {LocalStorageService} from 'ngx-webstorage';
import {ConfirmationService} from 'primeng/api';

import {Workbook} from 'exceljs';

import * as fs from 'file-saver';
import {Maga} from './model/maga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class AppComponent {
  api: any;
  frameworkComponents: any;
  defaultColDef: any;
  columnDefs;

  rowData = [];

  constructor(private dialogService: DialogService,
              private storage: LocalStorageService,
              private confirmationService: ConfirmationService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };

    this.columnDefs = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        width: 60
      },
      {headerName: 'שם פרטי', field: 'firstName', editable: false, width: 120},
      {headerName: 'שם משפחה', field: 'lastName', editable: false, width: 120},
      {headerName: 'סוג ת.ז', field: 'tzType', editable: false, width: 90},
      {headerName: 'ת.ז', field: 'tz', editable: false, width: 120},
      {headerName: 'מספר טלפון', field: 'phone', editable: false, width: 130},
      {headerName: 'טלפון משני', field: 'phoneSec', editable: false, width: 130},
      {headerName: 'ישוב השהיה בבידוד', field: 'city', editable: false, width: 160},
      {
        headerName: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditButtonClick.bind(this),
        },
        width: 90
      }
    ];
    this.defaultColDef = {resizable: false};
    this.rowData = this.storage.retrieve('maga');
    if (!this.rowData) {
      this.rowData = [];
    }
  }

  onGridReady(params) {
    this.api = params.api;

  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }


  // add new maga
  add(): void {
    const data = {
      isNew: true,
      currentRows: [...this.rowData]
    };
    const ref = this.dialogService.open(MagaFormComponent, {
      data,
      header: 'הכנסת מגע חדש',
      width: '600px'
    });

    ref.onClose.subscribe((user) => {
      if (user) {
        user.city = user.city.city;
        this.rowData.push(user);
        this.rowData = [...this.rowData];
        this.storage.store('maga', this.rowData);
      }

    });
  }

  // edit maga
  edit(maga): void {
    const data = {
      isNew: false,
      currentRows: [...this.rowData],
      maga
    };
    const ref = this.dialogService.open(MagaFormComponent, {
      data,
      header: 'עדכון פירטי מגע',
      width: '600px'
    });

    ref.onClose.subscribe((user) => {
      if (user) {
        user.city = user.city.city;
        this.rowData.forEach((m, index) => {
          console.log(m);
          console.log(m.uuid === user.uuid);
          if (m.uuid === user.uuid) {
            this.rowData[index] = user;
          }
        });
        this.rowData = [...this.rowData];
        this.storage.store('maga', this.rowData);
      }

    });
  }

  del(event, maga): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'האם למחוק?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'מחק',
      rejectLabel: 'בטל',
      rejectButtonStyleClass: 'reject-button',
      acceptButtonStyleClass: 'accept-button',
      accept: () => {
        this.rowData.forEach((m, index) => {
          console.log(m);
          if (m.uuid === maga.uuid) {
            this.rowData.splice(index, 1);
          }
        });
        this.rowData = [...this.rowData];
        this.storage.store('maga', this.rowData);
      },
      reject: () => {
        // reject action
      }
    });

  }

  // clear all magaim
  clear(event: Event): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'האם למחוק את כל המגעים?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'מחק',
      rejectLabel: 'בטל מחיקה',
      rejectButtonStyleClass: 'reject-button',
      acceptButtonStyleClass: 'accept-button',
      accept: () => {
        this.rowData = [];
        this.storage.store('maga', this.rowData);
      },
      reject: () => {
        // reject action
      }
    });

  }

  onEditButtonClick(params): void {
    if (params.action === 'edit') {
      this.edit(params.rowData);
    } else if (params.action === 'del') {
      this.del(params.event, params.rowData);
    }
  }

  // excel
  saveToExcel(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('פריטים פעילים מסוג _פרטי מגעים_');
    const header = [
      '(אל תשנה) פרטי מגע',
      '(אל תשנה) בדיקת סיכום של שורה',
      '(אל תשנה) השתנה ב:',
      'שם פרטי',
      'שם משפחה',
      'סוג ת.ז',
      'ת.ז',
      'מספר טלפון',
      'טלפון משני',
      'סוג מגע',
      'פירוט נוסף על אופי המגע',
      'קרבה משפחתית',
      'קשר',
      'יישוב השהייה בבידוד',
      'הקמת דיווח בידוד',
      'סטטוס',
      'האם חש בטוב',
      'האם סובל ממחלות רקע',
      'האם חי באותו הבית עם המאומת',
        'מפגש חוזר עם המאומת',
      'עבודה עם קהל במסגרת העבודה',
      'האם עוסק באחד מן התחומים הבאים',
      'האם נדרש סיוע עבור מקום בידוד'];
    const heaerRow = worksheet.addRow(header);
    this.rowData.forEach((r: Maga) => {
      const temp = [];
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push(r.firstName);
      temp.push(r.lastName);
      temp.push(r.tzType);
      temp.push(r.tz);
      temp.push(r.phone);
      temp.push(r.phoneSec);
      temp.push('הדוק');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push(r.city);
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      temp.push('');
      worksheet.addRow(temp);
    });

    // set downloadable file name
    const fname = 'מגעים';

    // add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '.xlsx');
    });

  }
}
