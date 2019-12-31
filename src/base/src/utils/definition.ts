// table实体类型
export interface BaseTableState {
  /**
   * 列表是否在加载中
   */
  loading: boolean;
  /**
   * 表格具体显示的数据
   */
  data: any[];
  /**
   * 当前编辑对象，若不为 null 则说明为编辑模式，适用于行内编辑或弹窗编辑
   */
  currentItem?: any | null;
  /**
   * 总记录数，用于计算分页
   */
  totalRecord?: number;
  /**
   * 搜索关键词
   */
  keyword?: string;
  /**
   * 当前页数
   */
  pageIndex?: number;
  /**
   * 当前每页展示条数
   */
  pageSize?: number;
  /**
   * 当前复合过滤条件
   * @TODO
   */
  filter?: any;
  /**
   * columns
   */
  // columns?: any[];
  /**
   * 当前选中的columns
   */
  checkedColumns?: any[];
  /**
   * 当前选择的row
   */
  selectedRowKeys?: string[];
}

/** badge实体类型 */
export interface BadgeItem {
  value: number;
  text: string;
  status?: 'success' | 'error' | 'default' | 'processing' | 'warning';
}
