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
*@last update  - 06/04/2017
*/

const ValidateForm = (function() {

    /*
    @object - settings
    configuration settings
    */
    const settings = {
        formName : '',// name of form to process
        formId : '',
        email : '', // first email input
        emailConfirmId : '', // confirm email
        password : '', // first password input
        passwordConfirmId : '', // password confirm
        errorClass : 'error', // class name of message box
        msg : true, // set display message or not bool
        globalMsg : '', // id of single use messge box
        highlight : true,
        tick : '&#10004', // html for tick
        cross : '&#10060', // html for cross
        tickClass : '', // use ticks and crosses bool
        checkArray : [], // array of ids of found input fields in form
        debug : false,
        // Default success and error messages
        emailsMatch : 'Emails Match',
        emailsNoMatch : 'Emails don\'t match',
        inValidEmail : 'Not a Valid Email',
        validEmail : 'Valid Email',
        isNumber : 'Number is Valid',
        isNotNumber : 'Not a Number',
        isNotDate : 'Not a Valid Date',
        isDate : 'Valid Date',
        isUrl : 'Valid Url',
        isNotUrl : 'Not a Valid Url',
        validPassword : 'Password is valid',
        inValidPassword : 'Invalid Password !',
        passwordsMatch : 'Passwords Match', 
        passwordsNoMatch : 'Passwords Don\'t Match!', 
        textOk : 'Text ok',
        textNoOk : 'Reuired text',
        checked : 'Box Checked thank you',
        unChecked : 'Please check box'
    };
    
    /*
    @function _getInputs - search through selected form for inputs
    loop through them and send to _getData() to add eventListeners
    */
    const _getInputs = function() {

        var form = document.forms[settings.formName];
        // check if form id is valid else output warning
        if (!form){  
            _debug('WARNING ! Form requires id equal to init paramaer'); 
            return false; 
        }
           
        const formLength = form.length;
        settings.formId = form.id;
        
        // find all inputs within the form
        for (let i = 0; i < formLength; i +=1) {
            _getData(form[i]);
        }

    };
    
    /*
    @function _getData - add event listeners to each input
    @param object input - input object
    */
    const _getData = function(input) {

        // data-vf used to pass in data not normally provided by regular attributes
        const data = input.getAttribute('data-vf');
        let type = input.getAttribute('type');
        const id = input.getAttribute('id');
        // check if input fields
        if (!id) {  
            _debug(`WARNING !  ${type} Input Requires an id`), type = 'ignore'; 
        }        

        if (data === 'confirm') { 
            type = type + '-' +'confirm'; }
        else if (data === 'ignore' ){ 
            type = 'ignore'; 
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
        case 'text' :
            document.getElementById(id).addEventListener('input', _checkText);
            break;     
        case 'checkbox' :
            document.getElementById(id).addEventListener('change', _checkBox);                 
            break;                 
        case 'ignore' :
            _removeIdFromArray(id);
            break;   
        }
    };

    // function to check email is valid 
    const _checkEmail = function() {
        // regular expression to find out if email is valid
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // chceck email is valid
        const check = regex.test(this.value);
 
        if (settings.emailConfirmId) {
            _checkIfEmailConfirm();
        }  
         
        if (check) {
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
    const _checkConfirmEmail = function() {
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
    const _checkIfEmailConfirm = function() {
        const confirmEmail = document.getElementById(settings.emailConfirmId).value;
        if(!confirmEmail || settings.email) return
        if (confirmEmail === settings.email) {
            _success(settings.emailConfirmId, 'emailsMatch');
        } else {
            _error(settings.emailConfirmId, 'emailsNoMatch');
        }        
    };
    
    /*
    @function _checkNumber - check if we have a valid number
    */
    const _checkNumber = function (){
        if (isNaN(this.value) || this.value.length === 0) {
            _error( this.id, 'isNotNumber');       
        } else {
            _success( this.id, 'isNumber');              
        }
    };

    /*
    @function _checkDate - check if we have a valid date either y/m/d or d/m/y
    */
    const _checkDate = function() {
        // regular expression to match d/m/y
        const regEx = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
        // regular expression to match y/m/d
        // TODO add better reg ex for this
        const regExRev = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
   
        if (regEx.test(this.value) || regExRev.test(this.value)) {
            _success( this.id, 'isDate');              
        } else {
            _error(this.id, 'isNotDate');       
        }
    };

    /*
    @function _checkUrl - see if the url supplied is valid -
        works with urls starting with http, https or ftp
    */
    const _checkUrl = function() {
        const regEx = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        
        if (regEx.test(this.value)) {
            _success( this.id, 'isUrl' );
        } else {
            _error( this.id, 'isNotUrl' );
        }
    };
    
    /*
    @function _checkPasword - check password is valid
    */
    const _checkPassword = function() {

        const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (regEx.test(this.value)) {
            settings.password = this.value;
            _success(this.id, 'validPassword');
            _checkIfPasswordConfirm()
        } else {
            _error(this.id, 'inValidPassword');
            _checkIfPasswordConfirm();
        }

    };
    
    /*
    @function _checkConfirmPassword - check confirm password is equal to first
    */
    const _checkConfirmPassword = function() {

        if ( settings.password === this.value ) {
            _success( this.id, 'passwordsMatch' );
        } else {
            _error( this.id, 'passwordsNoMatch' );
        }
          
    };

    /*
    @function _checkIfPasswordConfirm - this function is used when on the off
    chance the confirm password is entered first the feedback will still reflect
    any changes when the origin password is entered.
    */
    const _checkIfPasswordConfirm = function() {
        const confirmPass = document.getElementById(settings.passwordConfirmId).value;
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
    const _checkForm = function(event) {
        event.preventDefault();
        const form = settings.formId;

        if (settings.checkArray.length > 1) {
            return false;
        } else {
            document.getElementById(form).submit();
        }
    };
    
    /*
    @function _checkText - check a text input has at least some data
    */
    const _checkText = function() {
        (this.value.length > 0)
            ? _success(this.id, 'textOk')
            : _error(this.id, 'textNoOk');
    };
    
    const _checkBox = function() {
        if(this.checked) {
           _success(this.id, 'checked')         
        } else {
           _error(this.id, 'unChecked');        
        }
    };
    
    /*
    @function _debug - Any form errors repoerted in console to help dev
    */
    const _debug = function(msg) {
        if (settings.debug) {
            console.log( msg );
        }          
    };
    
    /*
    @function _success - display message to user that the input they have provided
        is valid
    @param string id - id of input tag
    @param string output - refers to the property in the settings objecct
        which holds the message to dispaly for the input field when input is valid    
    */
    const _success = function(id, output) {
        let msg;
        if (settings.highlight) {
            document.getElementById(id).style.border = '2px solid green';
        }
        if (settings.msg) {
            // decide type of message to display 
            // globalMsg is a single boxed area to dispaly all messages
            if (settings.globalMsg) {
                msg = document.getElementById(settings.globalMsg);
            // tickClass displays only a tick if correct or cross if invalid    
            }  else {
                // regular display text around input - message element must be
                // directly above input due to use of previousElementSibling method
                msg = document.getElementById(id).previousElementSibling;
            }
            if (settings.tickClass) {
                output = settings.tick;
            } else {
                output = settings[output];        
            }        
            // add error class to box
            msg.classList.remove('error');
            // add success class box        
            msg.classList.add('success');
            // the text to show to user
            msg.innerHTML = output;
            // check if id is in the checkArray
        }
        _removeIdFromArray(id);
    };
    
    /*
    @function _removeIdFromArray - remove id from settings.checkArray
    */
    const _removeIdFromArray = function(id) {
        const haveId = settings.checkArray.includes(id);
        if (haveId) {
            const index = settings.checkArray.indexOf(id);
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
    const _error = function(id, output) {
        let msg;
        if (settings.highlight) {
            document.getElementById(id).style.border = '2px solid red';
        }
        if (settings.msg) {
            if (settings.globalMsg) {
                msg = document.getElementById(settings.globalMsg);
            } else {
                msg = document.getElementById(id).previousElementSibling;
            }
            if (settings.tickClass) {
                output = settings.cross;
            } else {
                output = settings[output];        
            }
            // display output
            msg.classList.remove('success');
            msg.classList.add('error');
            msg.innerHTML = output;            
        }

        const haveId = settings.checkArray.includes(id);
        if (!haveId) {
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
        init: function(formName) {
            settings.formName = formName;
            _getInputs();
            return this;
        },
        /*
        @function - changeErrorClass - change the class of the success / error
             box used to supply feedback to user
        @param string value - name of class to change to.     
        */
        changeErrorClass: function(value) {
             settings.errorClass = value;
        },
        /*
        @function setMsg - dev can configure custom messages for each input type
            depending on whether the data supplied id valid or not
        @param string set - the settings.{property} to change.
        @param string msg - the message stored as value to property    
        */
        setMsg: function(set, msg) {
            settings.msg = true;
            settings[set] = msg;
            return this;
        },
        /*
        @function globalMsg - use a single message box for output
        @param string id - id of the message box to use
        */
        globalMsg: function(id) {
            settings.msg = true;        
            settings.globalMsg = id;
        },
        /*
        @function tickCross - dispaly just a simple tick for valid and cross for invalid
        @param string setTickClass - class of element to display ticks and crosses with
        */
        tickCross: function(setTickClass) {
            settings.msg = true;        
            settings.tickClass = setTickClass;
        },
        /*
        @function msg - turn off messages and only use highlight input borders 
        */
        msgOff: function() {
            settings.msg = false;
        },
        /*
        @function highlightOff - turn off highlighting around input borders
        */
        highlightOff: function() {
            setings.highlight = false;
        },
        /*
        @function debugOff - switch on debugging errors to console
        @param string value - if value is settings - console.log will show a JSON
             string of all the settings
        */
        debug: function(value) {
            settings.debug = value;
            console.log(JSON.stringify(settings));
        }
    };

})();
