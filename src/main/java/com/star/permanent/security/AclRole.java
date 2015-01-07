package com.star.permanent.security;

/*import com.snda.sysdev.security.uam.authentication.UamAuthenticationToken;
import com.snda.sysdev.security.uam.authority.ScopedGrantedAuthority;
import com.snda.sysdev.security.uam.userdetails.User;*/
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.CollectionUtils;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by suheng.cloud on 2014/11/24.
 */
public class AclRole {
    /*public static final String ROLE_ADMIN = "ADMIN";
    public static Boolean isAdmin(Principal principal){
        if(principal == null){
            return true;
        }
        User user = (User)((UamAuthenticationToken) principal).getUserDetails();
        for(GrantedAuthority authority : user.getAuthorities()){
            if(authority.getAuthority().equalsIgnoreCase(ROLE_ADMIN)){
                return true;
            }
        }
        return false;
    }
    public static List<Long> getAclIds(Principal principal){
        List<Long> ids = new ArrayList<Long>();
        if(principal != null){
            for (GrantedAuthority authority: ((Authentication)principal).getAuthorities()) {
                ScopedGrantedAuthority scopedGrantedAuthority = (ScopedGrantedAuthority)authority;
                List<Long> idList = scopedGrantedAuthority.getIdList();
                if (!CollectionUtils.isEmpty(idList)){
                    ids.addAll(idList);
                }
            }
        }
        return ids;
    }*/
}
