import { Component, OnInit } from '@angular/core';
// import { assetUrl } from 'src/single-spa/asset-url';
import { AppService } from "./app.service";
import { getParams } from "./utils/getParams";

@Component({
  selector: 'batch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  // title = 'batch';
  // yoshiUrl = assetUrl("yoshi.png");
  isShowLoding: boolean = false;

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.appService.getLoding().subscribe((isShow) => {
      this.isShowLoding = isShow;
    });
    this.appService.getAllDicAndDepart();
  }
}
