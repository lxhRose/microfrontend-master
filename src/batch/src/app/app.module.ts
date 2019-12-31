import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptors } from "./utils/http/http-interceptors";
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// antd单独引入
import { IconsProviderModule } from './icons-provider/icons-provider.module';
import {
  NZ_I18N,
  zh_CN,
  NzButtonModule,
  NzDatePickerModule,
  NzCheckboxModule,
  NzSelectModule,
  NzTableModule,
  NzIconModule,
  NzInputModule,
  NzModalModule,
  NzRadioModule,
  NzGridModule,
  NzSpinModule,
  NzToolTipModule,
  NzNotificationModule,
  NzMessageModule
} from 'ng-zorro-antd';

// 组件相关引入
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { VitalSignsComponent } from './pages/vital-signs/vital-signs.component';
import { VitalHeaderComponent } from './pages/vital-signs/vital-header/vital-header.component';
import { VitalTableComponent } from './pages/vital-signs/vital-table/vital-table.component';
import { TableCheckboxComponent } from './pages/vital-signs/vital-table/table-checkbox/table-checkbox.component';
import { TableInputComponent } from './pages/vital-signs/vital-table/table-input/table-input.component';
import { TableSelectComponent } from './pages/vital-signs/vital-table/table-select/table-select.component';
import { ChooseModalComponent } from './pages/vital-signs/vital-header/choose-modal/choose-modal.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OtherSelectComponent } from './pages/vital-signs/vital-table/other-select/other-select.component';
import { MeasuresModalComponent } from './components/measures-modal/measures-modal.component';
import { TableBtnComponent } from './pages/vital-signs/vital-table/table-btn/table-btn.component';
import { TableDateRangeComponent } from './pages/vital-signs/vital-table/table-date-range/table-date-range.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
    VitalSignsComponent,
    VitalHeaderComponent,
    VitalTableComponent,
    TableCheckboxComponent,
    TableInputComponent,
    TableSelectComponent,
    ChooseModalComponent,
    LoadingComponent,
    OtherSelectComponent,
    MeasuresModalComponent,
    TableBtnComponent,
    TableDateRangeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzButtonModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzSelectModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzRadioModule,
    NzGridModule,
    NzSpinModule,
    NzToolTipModule,
    NzNotificationModule,
    NzMessageModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptors, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
