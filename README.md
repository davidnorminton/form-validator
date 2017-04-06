<h1>form-valid.js</h1>

<p>
Form-valid.js is a javascript program which adds event listeners to all inputs
within an 'id' specified form. Form-valid.js also has a range of methods to display 
error / success messages which are easy to change and customise.
</p>

<h2>Quick Start</h2>

<p>
Before we start a few must haves ...<br />

1) All inputs which need validating require an id which is used by the script to handle
the messages.<br />

2) If you want to have a message box with appears around the input this should be 
placed in the html above the input with a standard class for the error / success
messages.<br />
3) Ensure the id of the submit input is not 'submit' as this will allow the
form to submit the data without validation !
</p>
<h2>The code</h2>
<p>
To run the script over your form simply place the line <code>ValidateForm.init('myform')</code>
within script tags below where form-valid.js is included....
</p>
<code>
<script src="form-valid.js"></script>
<script>
ValidateForm.init('myform')
</script>
</code>
<br />
<p>
Please note the argument to ValidateForm.init should be the 'id' used by the form!
<br />
And that's it, form-valid will now be validating your form and sending default messages.
</p>

<h2>Options : </h2>
<h3>Custom error / success messages</h3>
<p>
Form-valid.js has a range of default messages wich supply feedback to the user,
all of these can be altered to messages of your choice via the addittion of a little extra
code <code>ValidateForm.setMsg( 'emailsMatch' , 'Good Match');</code><br />
The format for this is ValidateForm.setMsg('OUTPUT_IDENTIFIER', 'YOUR_MESSAGE')<br />
<b>The following are all the available identifiers you can use</b><br />
<table>
    <tr>
        <td><b>IDENTIFIER</b></td>
        <td><b>USAGE</b></td>
    </tr>
    <tr>
        <td>emailsMatch</td>
        <td>Success - emails are a match</td>
    </tr>
    <tr>
        <td>emailsNoMatch</td>
        <td>Error - emails don't match</td>
    </tr>
    <tr>
        <td>inValidEmail</td>
        <td>Error - email is not valid</td>
    </tr>
    <tr>
        <td>validEmail</td>
        <td>Success - email is valid</td>
    </tr>
    <tr>
        <td>isNumber</td>
        <td>Success - the number is good</td>
    </tr>
    <tr>
        <td>isNotNumber</td>
        <td>Error - not a real number</td>
    </tr>
    <tr>
        <td>isNotDate</td>
        <td>Error - not a valid date</td>
    </tr>
    <tr>
        <td>isDate</td>
        <td>Success - date is valid</td>
    </tr>
    <tr>
        <td>isUrl</td>
        <td>Success - valid url</td>
    </tr>
    <tr>
        <td>isNotUrl</td>
        <td>Error - not a valid url</td>
    </tr>
    <tr>
        <td>validPassword</td>
        <td>Success - password is valid</td>
    </tr>
    <tr>
        <td>inValidPassword</td>
        <td>Error - not a valid password</td>
    </tr>
    <tr>
        <td>passwordsMatch</td>
        <td>Success - Passwords match</td>
    </tr>
    <tr>
        <td>passwordsNoMatch</td>
        <td>Error - Passwords don't match</td>
    </tr>    
    <tr>
        <td>textOk</td>
        <td>Success - provided text in input</td>
    </tr>    
    <tr>
        <td>textNoOk</td>
        <td>Error - no text in input</td>
    </tr>                                                                
</table>
</p>
<h3>How to display messages</h3>
<p>
The error / success messages can be supplied in a variety of ways, firstly by
a simple change in color of the input borders; green meaning success, and red for 
error.<br />
The second is via a message with appears above the input and displays
either the default messages or your own custom messaegs. This box can also be
configured to either show a success 'tick' or an error 'cross'.<br />
The final way is to have the output displayed in a single box anywhere you decide
on the page, the position would be made via css, as with all styles made on the
output box's.
</p>
<h4>Above input messages</h4>
<p>
The default of the script is to show the error messages above the input so only
the css would need to be supplied to these message box's.<br />
The default class for the feedback box is 'error' this can be changed :
</p>
<code>
ValidateForm.changeErrorClass('YOUR_CUSTOM_FEEDBACK_BOX_CLASS');
</code>
<h4>Simply highlight inputs</h4>
<p>
By default the input fields are highlighted to show error/ success, but this
can be turned off ...
</p>
<code>
ValidateForm.highlightOff();
</code>
<p>
If you oly want ot highlight the input fields and display no messages then use ..
</p>
<code>
ValidateForm.msgOff();
</code>
<h4>Single message box</h4>
<p>
To display a single message which is customised by css and displayed where you like..
</p>
<code>
ValidateForm.globalMsg('alert');
</code>
<p>
Here 'alert' is the id of the element with which the feedback will be displayed in.
</p>
<h4>Tick and cross feedback</h4>
<p>
To display your feedback as a simple tick for success and a cross for error,
simply add the line below.
</p>
<code>
ValidateForm.tickCross('message');
</code>
<h3>How the input is validated</h3>
<p>
A quick note on what the form validator deems to be valid input.<br />
Emails are of any type of valid format email, numbers are any number ie not a-z or symbol,
the url begins with either http or https, and the password must be at least eight
characters long, one letter must be uppercase and one lowercase and must constain
at least one number ie Password1.
</p>
<h3>Debugging</h3>
<p>
Form-valid.js has a simple debugging tool to help the developer incorporate form-valid.js
into their code.
</p>
<code>
ValidateForm.debug();
ValidateForm.debug('settings');
</code>
<p>
Debug on it's own will supply error messages which can help in finding out why 
your code isn't working, and the handy 'settings' argument will return  a JSON
object of all the settings in the script and their values. Note these are run
singular so either use "ValidateForm.debug();" or "ValidateForm.debug('settings');";
</p>
