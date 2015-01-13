/**
 * Created by suheng.cloud on 2015/1/13.
 */
angular.module("app.services")
    .factory('HttpConnector',function($http,CONTENT_TYPE){
    return {
        postData:simpleHttpPost
    };
    function simpleHttpPost(url,requestData,contentType,urlParams,success, error) {
        var httpContentType;
        if(contentType){
            httpContentType = contentType;
        }else{
            httpContentType = CONTENT_TYPE.form;
        }
        return $http.post(url,requestData , {params: urlParams, headers: {'Content-Type': httpContentType}})
            .success(function (data, status, headers, config) {
                if (success) {
                    success(data, status, headers, config);
                }
            }).error(function (data, status, headers, config) {
                if(error){
                    error(data,status,headers,config);
                }
            })
    }
})
    .factory('PromiseService',function($q){
        return {
            httpDataResolve:httpDataResolve,
            httpPaginResolve:httpPaginResolve
        };
        function httpDataResolve(httpPromise){
            return $q.when(httpPromise).then(function (httpPromise) {
                if (httpPromise && httpPromise.status === 200) {
                    return httpPromise.data;
                }
                return null;
            })
        }
        function httpPaginResolve(httpPromise) {
            return $q.when(httpPromise).then(function (httpPromise) {
                if (httpPromise && httpPromise.status === 200) {
                    var ajaxResult = httpPromise.data;
                    if (ajaxResult.success) {
                        return {totalCount: ajaxResult.totalCount, list: ajaxResult.data};
                    } else {
                        alert(ajaxResult.data);
                    }
                } else {
                    alert("http connect fail");
                }
                return null;
            })
        }
    })
;
