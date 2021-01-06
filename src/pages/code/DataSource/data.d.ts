import {PageRequest} from "@/services/PublicInterface";

export interface DataSourceInfo {
  id: number;
  delFlag: number;
  dataBaseType: string;
  dataBaseShowName: string;
  dataBaseHost: string;
  dataBasePort: string;
  dataBaseName: string;
  dataBaseProperties?: string;
  dataBaseUserName: string;
  dataBasePassword: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
  checked: boolean;
}

export interface QueryDataSourceInfo extends PageRequest{
  dataBaseHost?: string;
  dataBaseShowName?: string;
  dataBaseType?: string;
}

export interface DataSourceType {
  type: string;
  driver: string;
  prefix: string;
  properties: string;
  port: string;
}
