import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {ColumnEntity, EntityCodeGenerator, MicroServiceGenerator, TableEntity} from "@/pages/code/generator/data";
import {GenCodeEntity, GeneratorCodeVo, TemplateInfo} from "@/pages/code/generator/data";

export async function getTableInfoByDataSourceId(dataSourceId: number) {
  return request<ResponseData<TableEntity[]>>(`/api/codeGen/handleCenter/getDataSourceTables?dataSourceId=${dataSourceId}`);
}

export async function removeCacheTables(dataSourceId: number) {
  return request<ResponseData<string>>(`/api/codeGen/handleCenter/removeCacheTables?dataSourceId=${dataSourceId}`);
}

export async function getColumnInfoByDataSourceId(dataSourceId: number, tableName: string) {
  return request<ResponseData<ColumnEntity[]>>(`/api/codeGen/handleCenter/getTableColumns?dataSourceId=${dataSourceId}&tableName=${tableName}`);
}

export async function removeCacheColumns(dataSourceId: number, tableName: string) {
  return request<ResponseData<string>>(`/api/codeGen/handleCenter/removeCacheColumns?dataSourceId=${dataSourceId}&tableName=${tableName}`);
}

export async function getTemplateInfo(type: string) {
  return request<ResponseData<TemplateInfo[]>>(`/api/codeGen/handleCenter/getTemplateInfo?type=${type}`);
}

export async function tableGeneratorCode(data: GenCodeEntity) {
  return request<ResponseData<GeneratorCodeVo>>(`/api/codeGen/handleCenter/tableGeneratorCode`, {
    method: "POST",
    data
  });
}

export async function microServiceGeneratorCode(data: MicroServiceGenerator) {
  return request<ResponseData<GeneratorCodeVo>>(`/api/codeGen/handleCenter/microServiceGeneratorCode`, {
    method: "POST",
    data
  });
}

export async function entityGeneratorCode(data: EntityCodeGenerator) {
  return request<ResponseData<GeneratorCodeVo>>(`/api/codeGen/handleCenter/entityGeneratorCode`, {
    method: "POST",
    data
  });
}

export async function downloadCodeZip(downloadKey: string) {
  return request<any>(`/api/codeGen/handleCenter/downloadCodeZip?downloadKey=${downloadKey}`, {
    method: 'GET',
    responseType: 'blob'
  });
}
