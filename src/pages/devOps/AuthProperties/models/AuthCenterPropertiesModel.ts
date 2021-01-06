import {useCallback, useState} from "react";
import {getAuthorizationCenterConfigProperties} from "@/pages/devOps/AuthProperties/service";
import {AuthLoginConfigProperties} from "@/pages/devOps/AuthProperties/data";


export default function AuthPropertiesModel () {
  const [authConfigInfo, setAuthConfigInfo] = useState<AuthLoginConfigProperties>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getConfigInfo = useCallback(() => {
    setLoading(true);
    getAuthorizationCenterConfigProperties().then(res => {
      setLoading(false);
      if(res.code === 200) {
        setHasError(false);
        setAuthConfigInfo(res.data);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setHasError(true);
      setErrorMessage("查询过程中发生了错误");
    });
  }, []);

  return {
    authConfigInfo,
    loading,
    hasError,
    errorMessage,
    getConfigInfo,
  }
}
