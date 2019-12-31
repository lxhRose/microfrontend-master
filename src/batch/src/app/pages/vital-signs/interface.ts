export interface HeaderOption {
  headerDate: string,
  settings: any
}
export interface Select {
  timeObj: Array<any>,
  headerTime: string
}

export interface CheckAllOption {
  indeterminate: boolean,
  checkAll: boolean,
}

export interface TableOption {
  settings: any,
  columnData: any,
  parameters: any,
}

export interface TableData {
  name: string,
  visitno: string,
  bedno: string,
  ptname: string,
  chartno: string,
  reason: string,
  isTpr?: number,
  writeCareSheet?: number,
  DBP?: any,
  SBP?: any,
  departmentNo?: any,
  gender?: any,
  admittime?: any,
  pain?: any,
  painId?: any,
  painCode?: any,
  painColor?: any,
  painScore?: any,
  painDangerType?: any,
  painIsEdit?: any,
  height?: any,
  weight?: any,
  bpReason?: any,
  SBPStatus?: any,
  SBPmeasure?: any,
  DBPStatus?: any,
  faecesType?: any,
  disabled?: any,
}

export interface Column {
  id: string,
  type: string,
  sddName: string,
  width?: string,
  left?: string,
  align?: string,
  data?: any,
  range?: any,
  normalRange?: any,
  childrenId?: string,
  noNumber?: boolean,
  sddCode?: any,
  value?: any,
  default?: any,
  noOther?: any,
}

export interface CheckBox {
  indeterminate: boolean,
  checkAll: boolean,
  type: string
}

export interface MessageOption {
  id: string,
  data?: any
}

// export interface DataItem {
//   ivdCode: string,
//   measureDetail: string,
//   value1: string,
//   value2: string,
//   remark: string,
//   ivdIsTpr: string,
//   ivdRecord: string,
//   unableReason: string,
//   ivdTimePoint: string
// }

// export interface DataRow {
//   bmi?: DataItem, // bmi（当体重和身高都进行填写时计算得出）
//   bp?: DataItem, // 血压
//   girth?: DataItem, // 围长
//   height?: DataItem, // 身高
//   isTpr?: number, // 画入体温单
//   ivSource: number, // 来源 1pc 2 pda 3 其他
//   measureTime: string,  // 测量时间
//   patientNo: string, // 病人id
//   departmentNo: string, // 科室代码
//   bedNo: string, // 床号
//   pulse?: DataItem, // 脉搏
//   heartRate?: DataItem, // 心率
//   respire?: DataItem, // 呼吸
//   spo2?: DataItem, // 血氧
//   temperature?: DataItem, // 体温
//   timePoint: string, // 时间点（画入体温单时必填）
//   weight?: DataItem, // 体重
//   sleep?: DataItem, // 睡眠
//   period: DataItem, // 月经
//   faeces: DataItem, // 大便
//   beizhu: DataItem, // 备注列
//   specialEvent: DataItem, // 特殊事件
//   COSC: DataItem, // 意识
//   writeCareSheet: DataItem, // 写入护理记录单 0 不写 1 写入
// }

// export interface Data {
//   bulkDetailVoList: Array<DataRow>,
//   wardId: string
// }
