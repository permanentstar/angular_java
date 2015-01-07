package com.star.permanent.security;

/*import com.snda.sysdev.security.uam.Assertion;
import com.snda.sysdev.security.uam.UamRole;
import com.snda.sysdev.security.uam.authority.ScopedGrantedAuthority;
import com.snda.sysdev.security.uam.userdetails.AbstractUamAssertionUserDetailsService;
import com.snda.sysdev.security.uam.userdetails.User;*/
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.List;

public class UserDetailsService/* extends AbstractUamAssertionUserDetailsService*/ {

    /*@Override
    protected UserDetails loadUserDetails(Assertion assertion) {
        List<UamRole> roles = assertion.getRoles();
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        for (UamRole role: roles) {
            String code = role.getCode();
            String name = role.getName();
            ScopedGrantedAuthority authority = new ScopedGrantedAuthority(code, name, role.getItemCodes());
            authorities.add(authority);
        }
        return new User(assertion.getAccountInfo(), authorities);
    }*/
}
