package com.star.permanent.controller;

import com.star.permanent.model.UserInfo;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by suheng.cloud on 2015/1/12.
 */
@RestController
@RequestMapping("/rest")
public class WebController {
    @RequestMapping(value = "/user",method = RequestMethod.GET)
    public ResponseEntity<List<UserInfo>> getUserList(@RequestParam(required = false) Integer page,
                                                      @RequestParam(required = false) Integer prev,
                                                      @RequestParam(required = false) Integer pageCount){
        List<UserInfo> userInfoList = new ArrayList<UserInfo>();
        userInfoList.add(new UserInfo("s1","b1",21, Arrays.asList(new String[]{"admin","user"})));
        userInfoList.add(new UserInfo("s2","b2",22, Arrays.asList(new String[]{"user"})));
        userInfoList.add(new UserInfo("s3","b3",23, Arrays.asList(new String[]{"admin"})));
        HttpHeaders headers = new HttpHeaders();
        headers.set("total","3");
        headers.set("page",String.valueOf(page));
        headers.set("pageCount",String.valueOf(pageCount));
        //throw new RuntimeException("error");
        return new ResponseEntity<List<UserInfo>>(userInfoList,headers, HttpStatus.OK);
    }
}
