const accountViews=document.querySelectorAll(".account-view");
const accountButtons=document.querySelectorAll("[data-view]");

function showAccountView(id){
 accountViews.forEach((view)=>view.classList.toggle("active",view.id===id));
 document.querySelectorAll(".account-menu button").forEach((button)=>button.classList.toggle("active",button.dataset.view===id));
}

accountButtons.forEach((button)=>{
 button.addEventListener("click",()=>showAccountView(button.dataset.view));
});

document.querySelectorAll(".account-form").forEach((form)=>{
 form.addEventListener("submit",(event)=>event.preventDefault());
});

document.querySelector("#login .account-form").addEventListener("submit",(event)=>{
 event.preventDefault();
 sessionStorage.setItem("bookLendingLoggedIn","true");
 window.location.assign("index.html");
});

document.querySelector(".logout-link").addEventListener("click",()=>{
 sessionStorage.removeItem("bookLendingLoggedIn");
 window.location.assign("index.html");
});

showAccountView(location.hash.slice(1)||"login");