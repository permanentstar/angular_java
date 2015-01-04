'use strict';

/* Constants */

app.constant('USER_ROLES', {
        'all': '*',
        'admin': 'ROLE_ADMIN',
        'user': 'ROLE_USER'
    })
    .constant('LANGUAGES', {
        'ca': 'Catalan',
        'zh-tw': 'Chinese (traditional)',
        'da': 'Danish',
        'en': 'English',
        'fr': 'French',
        'de': 'German',
        'kr': 'Korean',
        'pl': 'Polish',
        'pt-br': 'Portuguese (Brazilian)',
        'ru': 'Russian',
        'es': 'Spanish',
        'sv': 'Swedish',
        'tr': 'Turkish'
    });



angular.module("app.services").constant('CONTENT_TYPE',{
    'json':'application/json;charset=utf-8',
    'form':'application/x-www-form-urlencoded;charset=utf-8'
});
