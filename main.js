// check if user qs exists
var urlObject = new URL(document.location.href);
var params = urlObject.searchParams;

// Output — 10
var userQS = params.get("user");

if(userQS!=undefined){
    // page with user data.
    renderUserData(userQS)
}else{
    // redirect to home page
    location.replace('/')
}

