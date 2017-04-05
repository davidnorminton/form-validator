/*
* ValidateForm - adds event listeners to all inputs on a given form id
*              - shows valid or invalid input messages to user
*              - configure how message is displayed
*              - variables and functions are kept out of  global scope to avoid
*              - naming conflicts only ValidateForm should be global
*
*
*@author       - David Norminton
*@link         - http://davenorm.me
*@demo link    - http://davenorm.me/demo/validateform
*@wriiten      - 03/04/2017
*@last update  - 04/04/2017
*/

ValidateForm = ( function () {

    /*
    @object - settings
    configuration settings
    */
    var settings = {
        formName : '',// name of form to process
        formId : '',
        email : '', // first email input
        emailConfirmId : '', // confirm email
        password : '', // first password input
        passwordConfirmId : '', // password confirm
        errorClass : 'error', // class name of message box
        globalMsg : '', // id of single use messge box
        highlight : true,
        tick : '&#10004', // html for tick
        cross : '&#10060', // html for cross
        setTickClass : '', // use ticks and crosses bool
        checkArray : [], // array of ids of found input fields in form
        // Default success and error messages
        emailsMatch : 'Emails Match', // emails match msg
        emailsNoMatch : 'Emails don\'t match', // emails don't match
        inValidEmail : 'Not a Valid Email', // email not valid
        validEmail : 'Valid Email', // valid email msg
        isNumber : 'Number is Valid', // valid number
        isNotNumber : 'Not a Number', // not a valid number
        isNotDate : 'Not a Valid Date', // not a valid date
        isDate : 'Valid Date', // valid date
        isUrl : 'Valid Url', // valid url
        isNotUrl : 'Not a Valid Url', // not a valid url
        validPassword : 'Password is valid',
        inValidPassword : 'Invalid Password !',
        passwordsMatch : 'Passwords Match',
        passwordsNoMatch : 'Passwords Don\'t Match!',
    };
    
    /*
    @function _getInputs - search through selected form for inputs
    loop through them and send to _getData() to add eventListeners
    */
    var _getInputs = function () {

        var form = document.forms[settings.formName];
        settings.formId = form.id;
        // cehck if form exists
        if ( !form ) {
             console.log('free')
            _htmlError( 'form' );
            return false;
        }
        var formLength = form.length, i = 0;

        for ( ; i < formLength; i +=1 ) {
            _getData(form[i]);
        }

    };
    
    /*
    @function _getData - add event listeners to each input
    @param object input - input object
    */
    var _getData = function ( input ) {

        // data-vf used to pass in data not normally provided by regular attributes
        var data = input.getAttribute('data-vf');
        var type = input.getAttribute('type');
        var id = input.getAttribute('id');
        // check if input fields
        if (!id) {
            _htmlError(type);
            return false;
        }        

        if ( data === 'confirm' ) {
           type = type + '-' +'confirm';
        }
        
        /*
        settings.checkArray is used to hold the id of each input -
        if an input has the correct data supplied it is removed from array
        if the input becomes invalid again it is re added
        - here we add the id to the array
        */
        settings.checkArray.push(id)
        
        // each type of input has a particular function linked to it's eventListener
        switch (type) {

            case 'email':
                document.getElementById(id).addEventListener('input', _checkEmail);
                break;

            case 'email-confirm':
                settings.emailConfirmId = id;
                document.getElementById(id).addEventListener('input', _checkConfirmEmail);
                break;
     
            case 'number':
                document.getElementById(id).addEventListener('input', _checkNumber);
                break;

            case 'date' :
                document.getElementById(id).addEventListener('input', _checkDate);
                break;

            case 'url' :
                document.getElementById(id).addEventListener('input', _checkUrl);
                break;

            case 'password' :
                document.getElementById(id).addEventListener('input', _checkPassword);
                break;

            case 'password-confirm' :
                settings.passwordConfirmId = id;
                document.getElementById(id).addEventListener('input', _checkConfirmPassword);
                break;

            case 'submit' :
                document.getElementById(settings.formId).addEventListener('submit', _checkForm);
                break;
                
            default :
                //input has not type
                    

        }
    };

    // function to check email is valid 
    var _checkEmail = function () {
         // regular expression to find out if email is valid
         regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         // chceck email is valid
         var check = regex.test(this.value);
 
         if ( settings.emailConfirmId ) {
             _checkIfEmailConfirm();
         }  
         
         if ( check ) {
             // email address is stored and used later if a confirm email is required
             settings.email = this.value;  
                
             _success(this.id, 'validEmail');

         } else {

              _error(this.id, 'inValidEmail');

         }       

    };

    /*
    @function _checkConfirmEmail - checks if confirm email matches original
    */
    var _checkConfirmEmail = function () {

        if (this.value === settings.email) {
              _success(this.id, 'emailsMatch');
         } else {
              _error(this.id, 'emailsNoMatch');
         }
    };

    /*
    @function _checkIfEmailConfirm - its possible the confirm email will be
        entered before the original email is provided. This function is run
        in order to check that and to see if a any point they match
    */
    var _checkIfEmailConfirm = function () {

        var confirmEmail = document.getElementById(settings.emailConfirmId).value;

        if (confirmEmail === settings.email) {
              _success(settings.emailConfirmId, 'emailsMatch');

         } else {
              _error(settings.emailConfirmId, 'emailsNoMatch');

         }        

    };
    
    /*
    @function _checkNumber - check if we have a valid number
    */
    var _checkNumber = function () {

        if ( isNaN(this.value) || this.value.length === 0 ) {
            _error( this.id, 'isNotNumber');       
        } else {
            _success( this.id, 'isNumber');              
        }

    };

    /*
    @function _checkDate - check if we have a valid date either y/m/d or d/m/y
    */
    var _checkDate = function () {
        // regular expression to match d/m/y
        var regEx = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
        // regular expression to match y/m/d
        // TODO add better reg ex for this
        var regExRev = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
   
        if ( regEx.test( this.value ) || regExRev.test( this.value ) ) {
            _success( this.id, 'isDate');              
        } else {
            _error( this.id, 'isNotDate');       
        }
    };

    /*
    @function _checkUrl - see if the url supplied is valid -
        works with urls starting with http, https or ftp
    */
    var _checkUrl = function () {
    
        var regEx = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        
        if ( regEx.test(this.value) ) {
        
            _success( this.id, 'isUrl' );

        } else {

            _error( this.id, 'isNotUrl' );

        }
    };
    
    /*
    @function _checkPasword - check password is valid
    */
    var _checkPassword = function () {

        var regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if ( regEx.test(this.value) ) {
            settings.password = this.value;
            _success( this.id, 'validPassword' );
            _checkIfPasswordConfirm()
        } else {
            _error( this.id, 'inValidPassword' );
            _checkIfPasswordConfirm();
        }

    };
    
    /*
    @function _checkConfirmPassword - check confirm password is equal to first
    */
    var _checkConfirmPassword = function () {

        if ( settings.password === this.value ) {
            _success( this.id, 'passwordsMatch' );
        } else {
            _error( this.id, 'passwordsNoMatch' );
        }
          
    };

    var _checkIfPasswordConfirm = function () {
    
        var confirmPass = document.getElementById(settings.passwordConfirmId).value;

        if (confirmPass === settings.password) {
              _success(settings.passwordConfirmId, 'passwordsMatch');

         } else {
              _error(settings.passwordConfirmId, 'passwordsNoMatch');

         }         
    }; 

    /*
    @function _checkForm - make sure the dev supplied form id is found in html -
        if not supply a warning message
    */
    var _checkForm = function (event) {
        event.preventDefault();
        var form = settings.formId;

        if ( settings.checkArray.length > 1 ) {
             return false;
        } else {
             document.getElementById(form).submit();
        }
        
    }
    
    /*
    @function _htmlError - report that all inputs require an id tag
    */
    var _htmlError = function ( type ) {

        console.log( ( type === 'form')
                       ? "Form requires an id of that matches argument to init!"
                       : type + ' Requires an id' );      
    }
    
    /*
    @function _success - display message to user that the input they have provided
        is valid
    @param string id - id of input tag
    @param string output - refers to the property in the settings objecct
        which holds the message to dispaly for the input field when input is valid    
    */
    var _success = function ( id, output) {
    
        if (settings.highlight) {
            document.getElementById(id).style.border = '2px solid green';
        }
        // decide type of message to display 
        // globalMsg is a single boxed area to dispaly all messages
        if ( settings.globalMsg ) {
            var msg = document.getElementById(settings.globalMsg);
        // tickClass displays only a tick if correct or cross if invalid    
        } else if ( settings.tickClass) { 
             
        } else {
            // regular display text around input - message element must be
            // directly above input due to use of previousElementSibling method
            var msg = document.getElementById(id).previousElementSibling;
        }
        // add error class to box
        msg.classList.remove('error');
        // add success class box        
        msg.classList.add('success');
        // the text to show to user
        msg.innerHTML = settings[output];
        // check if id is in the checkArray
        var haveId = settings.checkArray.includes(id)        
        if ( haveId ) {
            var index = settings.checkArray.indexOf(id);

            if (index > -1) {
                 // input is valid so remove from checkArray
                 settings.checkArray.splice(index, 1);
            }
        }
    };
    
    /*
    @function _error - error message to display when input is invalid
    @param string id - id of input element
    @param string output - refers to the property in the settings objecct
        which holds the message to dispaly for the input field when input is invalid   
    */
    var _error = function ( id, output ) {
        if (settings.highlight) {
            document.getElementById(id).style.border = '2px solid red';
        }
        if ( settings.globalMsg ) {
            var msg = document.getElementById(settings.globalMsg);
        } else {
            var msg = document.getElementById(id).previousElementSibling;
        }    
        msg.classList.remove('success');
        msg.classList.add('error');
        msg.innerHTML = settings[output];

        var haveId = settings.checkArray.includes(id);
        if ( ! haveId ) {
            settings.checkArray.push(id);

        }

    };

    /*
    The following returned functions are exposed to the outside to allow
    properties to be altered
    */
    return {
        /*
        @function init - run the program 
        @param string formName - the id of the form to use
        */
        init : function (formName) {
            settings.formName = formName;
            _getInputs();

        },
        /*
        @function setMsg - dev can configure custom messages for each input type
            depending on whether the data supplied id valid or not
        @param string set - the settings.{property} to change.
        @param string msg - the message stored as value to property    
        */
        setMsg : function (set, msg) {
            settings[set] = msg;
        },
        /*
        @function globalMsg - use a single message box for output
        @param string id - id of the message box to use
        */
        globalMsg : function ( id ) {
            settings.globalMsg = id;
        },
        /*
        @function tickCross - dispaly just a simple tick for valid and cross for invalid
        @param string setTickClass - class of element to display ticks and crosses with
        */
        tickCross : function ( setTickClass ) {
            settings.tickClass = setTickClass;
        }
        
    };

})();
