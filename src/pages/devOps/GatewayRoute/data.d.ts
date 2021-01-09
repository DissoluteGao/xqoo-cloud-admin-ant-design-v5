import {PageRequest} from "@/services/PublicInterface";

export interface GatewayRouteInfo {
  id: number;
  serviceStatus: number;
  serviceId: string;
  serviceType: string;
  uri: string;
  predicates: string;
  filters: string;
  orderNo: number;
  serviceCname: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
  predicateDefinitionList: Definition[];
  filterDefinitionList: Definition[];
  isActive: number;
}

export interface GatewayRouteEntity {
  id: number|string|undefined;
  serviceStatus: number;
  serviceId: string;
  serviceType: string;
  uri: string;
  predicates: string;
  filters: string;
  orderNo: number;
  serviceCname: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
}

export interface GatewayPredicatesConfig {
  id: number;
  predicatesType: string;
  predicatesName: string;
  predicatesTips: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
}

export interface GatewayFiltersConfig {
  id: number;
  filtersType: string;
  filtersName: string;
  filtersTips: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
}

export interface GatewayRouteQuery extends PageRequest {
  id?: number;
  serviceStatus?: number;
  serviceId?: string;
  serviceType?: string;
  uri?: string;
  orderNo?: number;
  serviceCname?: string;
}

export interface Definition {
  name: string;
  args: object;
}
