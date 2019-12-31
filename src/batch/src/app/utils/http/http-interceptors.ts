/**
 * http请求拦截器
 * 2019-12-17
 * 吕兴海
 */
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { getParams } from "../../../../../common/utils/getParams";
import { Observable, TimeoutError } from 'rxjs';
import { finalize, tap, timeout } from 'rxjs/operators';
import { environment } from "./../../../environments/environment";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AppService } from "./../../app.service";
import { URL } from "../../../../../common/utils/requestUrl";

@Injectable()
export class HttpInterceptors implements HttpInterceptor {
  private baseUrl: string = environment.production
    ? `${URL}/topro/`
    : 'api/';

  constructor(
    private notificationService: NzNotificationService,
    private appService: AppService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // 设置请求头
    const authReq = req.clone({
      setHeaders: {
        token: getParams('token')
      },
      url: this.baseUrl + req.url
    });

    // loding
    if (!this.appService.getNoLoading()) this.appService.toogleLoding(true);

    // 监听返回
    return next.handle(authReq)
      .pipe(
        timeout(5000), // 设置超时时间
        tap(
          (event) => { // 请求成功
            if (
              event instanceof HttpResponse
              && event.body.code !== 'SUCCESS'
            ) {
              this.notificationService.error('ApiException', event.body.msg);
            }
          }, (error) => { // 请求失败
            if (error instanceof TimeoutError) {
              this.notificationService
                .error('TimeoutError', '请求超时，请稍后重试！');
            } else {
              this.notificationService
                .error('ApiException', '服务器故障，请稍后重试！');
            }
          }
        ),
        finalize(() => { // 无论请求成功还是失败
          if (!this.appService.getNoLoading())
            this.appService.toogleLoding(false);
          this.appService.setNoLoading(false); // 自动放开loading使用权
        })
      );
  }
}
