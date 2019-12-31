import { Component, OnInit, Input } from '@angular/core';
import { TableData } from "./../../interface";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { VitalSignsService } from "./../../vital-signs.service";
import { getParams } from "./../../../../utils/getParams";

@Component({
  selector: 'batch-vital-signs-table-btn',
  templateUrl: './table-btn.component.html',
  styleUrls: ['./table-btn.component.less']
})
export class TableBtnComponent implements OnInit {
  @Input() text: string;
  @Input() data: TableData[];
  @Input() i: number;
  @Input() id: string;
  @Input() icon: string;
  @Input() headerDate: string;

  painParams;

  constructor(
    private vitalSignsService: VitalSignsService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.vitalSignsService.getPainCallback().subscribe((data) => {
      if (data.index === this.i && this.id === "pain") {
        // console.log('response', data);
        const {
          score,
          iaId,
          dangerType,
          color,
          iaCode
        } = data.params;
        if (iaCode) {
          let chooseRow = [...this.data],
            index = this.i,
            chooseItem = chooseRow[index];
          if (chooseItem) {
            chooseItem["pain"] = score + '分(' + dangerType + ')';
            chooseItem.painId = iaId;
            chooseItem.painColor = color;
            chooseItem.painCode = iaCode;
            chooseItem.painScore = score;
            chooseItem.painDangerType = dangerType;
            chooseItem.painIsEdit = true;
          }
          this.data = chooseRow;
          this.painParams = {};
        } else {
          this.painParams = {};
        }
      }
    });
  }

  btnClick() {
    let chooseRow = [...this.data],
      id = this.id,
      index = this.i,
      chooseItem = chooseRow[index];
    if (id === "mews") {//menws评分
      if (chooseItem) {
        if (chooseItem[id]) {
          chooseItem[id] = "";
          chooseItem[id + "Color"] = "";
          this.data = chooseRow;
        } else {
          let params = {};
          const paramsArr = [//menus评分的传参：paramsId，从列表数据中拿到的响应的数据：id
            { id: "cosc", paramsId: "cocs", name: "意识", isMust: true },
            { id: "temp", paramsId: "temperature", name: "体温", isMust: true },
            { id: "heartRate", paramsId: "heartRate", name: "心率", isMust: true },
            { id: "respire", paramsId: "breathe", name: "呼吸", isMust: true },
            { id: "SBP", paramsId: "systolicPressure", name: "收缩压", isMust: true },
            // {id:"DBP",paramsId:"diastolicPressure",name:"收缩压"},
            { id: "spo2", paramsId: "spo2", name: "血氧", isMust: true },
            { id: "weight", paramsId: "weight", name: "体重" },
            { id: "height", paramsId: "height", name: "身高" },
          ]
          for (let i = 0; i < paramsArr.length; i++) {
            const arrItem = paramsArr[i];
            let reason = chooseItem[arrItem.id + "Reason"];
            if (arrItem.id === "SBP" || arrItem.id === "DBP") {
              reason = chooseItem["bpReason"];
            }
            if (chooseItem[arrItem.id] && !reason) {
              params[arrItem.paramsId] = chooseItem[arrItem.id]
            } else if (
              arrItem.id === "heartRate" && (!chooseItem[arrItem.id] || reason) && chooseItem["pulse"] && !chooseItem["pulseReason"]
            ) {
              params[arrItem.paramsId] = chooseItem["pulse"]
            } else if ((!chooseItem[arrItem.id] || reason) && arrItem.isMust) {
              this.notification.error(
                '错误',
                `请先输入${arrItem.id === "heartRate"
                  ? "心率或脉搏" : arrItem.name}`,
                { nzDuration: 2000 }
              );
              return false
            }
          }
          this.vitalSignsService.getMews(params).subscribe((res: any) => {
            let data = res && res.data;
            if (!data) return false;
            chooseItem[id] = data.score + "分(" + data.result + ")";
            chooseItem[id + "Color"] = data.color;
            this.data = chooseRow;
          });
        }
      }
    } else if (id === "pain") {//疼痛评分
      if (chooseItem) {
        const patientInfo = {
          visitno: chooseItem.visitno, divno: chooseItem.departmentNo,
          departno: getParams('bingquId'),
          // departno:this.props.bingquSelect.departno,
          gender: chooseItem.gender || "男", admittime: chooseItem.admittime, bedno: chooseItem.bedno
        };
        //ia:{iaId:566,iaCode:"CPOT"}
        let painParams = { patientInfo } as any;
        if (chooseItem.pain) {
          painParams.ia = {
            iaId: chooseItem.painId,
            iaCode: chooseItem.painCode
          }
        }
        this.painParams = painParams;
        let option = {
          id: 'pain',
          data: {
            index,
            params: {
              ia: painParams.ia,
              patientProfil: painParams.patientInfo,
              ctype: 'pain',
              daId: null,
              iaCode: '',
              bingqu: { departno: getParams('bingquId') },
              codeName: '疼痛评估',
              illnessType: 'AcutePain',
              assessType: 2,
              saveType: painParams.ia ? "edit" : "add",
              nowTime: this.headerDate
            }
          }
        }
        let event = this.vitalSignsService.getParentWindow();
        if (event) {
          // console.log('send', option.data);
          event.source.postMessage(JSON.stringify(option), event.origin);
        } else {
          this.notification.error(
            '错误',
            '疼痛评分打开失败，请重新打开【体征批量录入】页签',
            { nzDuration: 2000 }
          );
        }
      }
    }
  }
}
