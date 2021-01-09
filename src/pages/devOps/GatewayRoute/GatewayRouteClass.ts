import {GatewayRouteEntity} from "@/pages/devOps/GatewayRoute/data";

class GatewayRouteClass{
  gatewayRouteInfo: GatewayRouteEntity|undefined;

  constructor (routeInfo: GatewayRouteEntity | undefined) {
    if(!routeInfo){
      this.gatewayRouteInfo = {
        id: undefined,
        serviceStatus: 1,
        serviceId: '',
        serviceType: 'SYSTEM',
        uri: '',
        predicates: '[{"name":"Path","args":{"_genkey_0":"/yourPath/**"}}]',
        filters: '[{"name":"StripPrefix","args":{"_genkey_0":"1"}}]',
        orderNo: 1,
        serviceCname: ''
      }
    }else{
      this.gatewayRouteInfo = Object.assign(routeInfo);
    }
  }
  initRouteInfo() {
    return this.gatewayRouteInfo;
  }
}
export default GatewayRouteClass;
