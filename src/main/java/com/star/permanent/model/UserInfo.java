package com.star.permanent.model;

import java.util.List;

/**
 * Created by suheng.cloud on 2015/1/12.
 */
public class UserInfo {
    private String loginName;
    private Integer age;
    private String nickName;
    private List<String> roles;
    public UserInfo(){};
    public UserInfo(String loginName,String nickName,Integer age,List<String> roles){
        this.loginName = loginName;
        this.age = age;
        this.nickName = nickName;
        this.roles = roles;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
