import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {AuthLoginConfigProperties} from "@/pages/devOps/AuthProperties/data";

export async function getAuthorizationCenterConfigProperties() {
  return request<ResponseData<AuthLoginConfigProperties>>(`/api/authorization/resource/getAuthorizationCenterConfigProperties`);
}
