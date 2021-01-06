
export interface TableEntity {
  schemeName: string;
  tableName: string;
  comment: string;
  checked: boolean;
}

export interface ColumnEntity {
  primaryKey: boolean;
  autoIncrement: boolean;
  columnDisplaySize: number;
  columnName: string;
  columnsTypeName: string;
  nullAble: boolean;
  comment: string;
  checked: boolean;
}

export interface JavaTableColumnEntity extends ColumnEntity{
  javaFieldName: string;
  javaFieldType: string;
  javaAttrName: string;
}

export interface GenCodeEntity {
  dataSourceId: number;
  tableName: string;
  tableItem: TableEntity|undefined;
  columnDataArr: ColumnEntity[];
  templateNameArr: string[];
  packageName: string;
  handleName: string;
  className?: string;
  needDownload: boolean;
}

export interface MicroServiceGenerator {
  moduleName: string;
  modulePort: string;
  nacosNameSpace?: string;
  needDownload: boolean;
  templateNameArr: string[];
}

export interface EntityCodeGenerator {
  className: string;
  classComment: string;
  templateNameArr: string[];
  properties: JavaTableColumnEntity[];
}

export interface TemplateInfo {
  label: string;
  value: string;
  type: string;
  url: string[];
}

export interface PreviewCode {
  fileType: string;
  fileName: string;
  content: string;
  index: number;
}

export interface IndexTree {
  previewCodeIndex: number;
  title: string;
  key: string;
  children: IndexTree[];
  isLeaf: boolean;
}

export interface GeneratorCodeVo {
  downLoadKey: string;
  previewCodeList: PreviewCode[];
  indexTree: IndexTree[];
}
