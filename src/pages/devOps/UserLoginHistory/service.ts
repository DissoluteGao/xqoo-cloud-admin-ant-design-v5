
import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {UserLoginHistoryQuery, UserLoginHistoryResult} from "@/pages/devOps/UserLoginHistory/data";

export async function getUserLoginHistory(data: UserLoginHistoryQuery) {
  return request<ResponseData<PageResponse<UserLoginHistoryResult>>>(`/api/authorization/loginHistory/getLoginUserHistory`, {
    method: 'POST',
    data
  });
}
