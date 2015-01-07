package com.star.permanent.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

/**
 * Created by StarWolf on 2015/1/7.
 */
@Controller
public class IndexController {
    @RequestMapping("/")
    public String index(Principal principal){
        return "forward:/index.html";
    }
}
