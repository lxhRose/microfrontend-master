import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private allDic = new Subject<any>();
  private setLoding = new Subject<any>();
  private noLoading: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  setAllDic(dictionaryResponse) {
    this.allDic.next(dictionaryResponse)
  }
  getAllDic(): Observable<any> {
    return this.allDic.asObservable();
  }

  // 
  getAllDicAndDepart() {
    this.setNoLoading(true);
    return this.http.get(
      `pub/index/v1/fuse`,
      {
        params: { inHospitalStatus: '0' },
      }
    ).subscribe((res: any) => {
      if (res.code === 'SUCCESS') {
        // console.log(res);
        this.setAllDic(res.data.dictionaryResponse);
      }
    });
  }

  //发送消息
  toogleLoding(isShow: boolean) {
    this.setLoding.next(isShow);
  }
  //获取消息
  getLoding(): Observable<any> {
    return this.setLoding.asObservable();
  }

  setNoLoading(bol: boolean) {
    this.noLoading = bol;
  }
  getNoLoading(): boolean {
    return this.noLoading;
  }
}
