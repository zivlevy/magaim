import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AgGridModule} from 'ag-grid-angular';
import { ButtonRendererComponent } from './button-renderer/button-renderer.component';
import {ButtonModule} from 'primeng/button';
import { MagaFormComponent } from './maga-form/maga-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {HttpClientModule} from '@angular/common/http';
import {SelectButtonModule} from 'primeng/selectbutton';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {ToolbarModule} from 'primeng/toolbar';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {TooltipModule} from 'primeng/tooltip';
@NgModule({
  declarations: [
    AppComponent,
    ButtonRendererComponent,
    MagaFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AgGridModule.withComponents([ButtonRendererComponent]),
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    SelectButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToolbarModule,
    ConfirmPopupModule,
    TooltipModule,
    NgxWebstorageModule.forRoot(),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
