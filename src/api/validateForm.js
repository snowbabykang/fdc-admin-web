export const validatePhone = phone => {
    const reg =  /^1[3456789][0-9]{9}$/;
    if(!reg.test(phone)){
        return "请输入正确手机号";
    }else{
        return "";
    }
}


export const validateUpdatePsd = psd => {
    if (trim(psd) != psd) { 
        return "密码不能使用空格，请更换"; 
    } 
    if (psd.length < 6 || psd.length > 20) { 
        return "密码长度应为6-20位"; 
    } 
    var mreg = /^[\x00-\xff]{6,20}$/; 
    if (!mreg.test(psd)) { 
        return "6-20位数字、字母、英文标点符号";
    } 
    return "";
}


// 验证密码
/*
    必须是6~24位，以字母、数字开头结尾，
    有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，
    非顺序字符，至少包含5种不同的字符
*/
export const trim = psd => {
    return psd.replace(/\s+/g,"");
}
export const validatePsd = psd => {
    if (trim(psd) != psd) { 
        return "密码不能使用空格，请更换"; 
    } 
    if (psd.length < 6 || psd.length > 24) { 
        return "密码长度应为6-24位"; 
    } 
    var mreg = /^[a-zA-Z0-9][a-zA-Z0-9~!@$^\*\-_=\|]{4,22}[a-zA-Z0-9]$/; 
    if (!mreg.test(psd)) { 
        return "6-24位数字、字母、含“~ ! @ $ ^ * - _ = |”，以字母、数字开头结尾";
    } 
    if (checkStrong(psd) < 5) { 
        return "密码至少包含5种不同的字符"; 
    } 
    if (!checkPasswordRule(psd)) { 
        return "密码不能存在叠字以及连续性字母或数字"; 
    } 
    return "";

}

export const checkStrong = psd => {
    var regUpper = /[A-Z]/;
    var regLower = /[a-z]/;
    var regNum = /[0-9]/;
    var reg = /[~!@$^\*\-_=\|]/;
    var complex = 0;
    if(regLower.test(psd)) {
        ++complex;        
    }         
    if(regUpper.test(psd)) {            
        ++complex;         
    }         
    if(regNum.test(psd)) {      
        ++complex;        
    }
    if(reg.test(psd)){
        var length = psd.match(/[~!@$^\*\-_=\|]/g).length;
        complex += length;
    }
    return complex;
}

/** * 检查密码是否包含叠字字符串或者包含连续字母、连续数字字符串（如："aaa"，"abc"，"321"） */ 
export const checkPasswordRule = password => {
    //1.检查是否包含叠字字符串 
    var mreg = /^.*(.)\1{2,}.*$/; 
    if (mreg.test(password)) { return false; } 
        //2.检查是否包含连续字母、连续数字字符串 
        if (password.length >= 3) { 
            var flag = true; 
            for (var i = 0; i < password.length-2; i++) { 
            var ch1 = password.charCodeAt(i); 
            var ch2 = password.charCodeAt(i+1); 
            var ch3 = password.charCodeAt(i+2); 
            if ((ch1+1) == ch2) { 
                if ((ch2+1) == ch3) { 
                flag = false; break; 
                } 
            } else if ((ch1-1) == ch2) {
                if((ch2-1) == ch3) { 
                    flag = false; break; 
                } 
            } 
        } 
        return flag; 
    } 
    return true; 
}
