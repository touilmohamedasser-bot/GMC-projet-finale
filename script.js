
// HEALTH TRACKER PRO

let userData = JSON.parse(localStorage.getItem("healthUser")) || {
    name:"",
    age:0,
    height:0,
    weight:0,
    gender:"male",
    activity:1.2,
    goal:"Maintain Weight",
    bmi:0,
    bmr:0,
    calories:0,
    water:0,
    todayCalories:0,
    todayWater:0,
    workout:false,
    meals:[],
    history:[]
};
// Fix old data problems
userData.todayCalories ??= 0;
userData.todayWater ??= 0;
userData.meals ??= [];
userData.history ??= [];
userData.workout ??= false;
function saveData(){
localStorage.setItem(
"healthUser",
JSON.stringify(userData)
);
}

// NAVIGATION

function showPage(page){
document.querySelectorAll(".page")
.forEach(p=>p.style.display="none");
document.getElementById(page).style.display="block";
}
// LOGIN

function loadUser(){
let name=document.getElementById("username").value;
if(!name){
alert("Enter your name");
return;
}
userData.name=name;
saveData();
welcome.innerHTML=
"Welcome "+name+" 👋";
showPage("dashboard");
updateDashboard();
}

// HEALTH CALCULATION

function calculateHealth(){
userData.age=Number(age.value);
userData.height=Number(height.value);
userData.weight=Number(weightInput.value);
userData.gender=gender.value;
userData.activity=Number(activity.value);
userData.goal=goal.value;
let h=userData.height/100;
userData.bmi=
(userData.weight/(h*h)).toFixed(1);

// BMR

if(userData.gender=="male"){
userData.bmr=
10*userData.weight+
6.25*userData.height-
5*userData.age+
5;
}
else{
userData.bmr=
10*userData.weight+
6.25*userData.height-
5*userData.age-
161;
}

// Calories

userData.calories=
Math.round(userData.bmr*userData.activity);
if(userData.goal=="Lose Fat")
userData.calories-=400;
if(userData.goal=="Gain Muscle")
userData.calories+=300;

// Water

userData.water=
Math.round(userData.weight*35);
saveData();
updateDashboard();
alert("Profile saved 💪");
}
// DASHBOARD

function updateDashboard(){
weight.innerHTML=
userData.weight+" kg";
bmi.innerHTML=
userData.bmi;
bmr.innerHTML=
Math.round(userData.bmr)+" kcal";
caloriesGoal.innerHTML=
userData.calories+" kcal";
waterGoal.innerHTML=
userData.water+" ml";
dailyCalories.innerHTML=
userData.todayCalories+" kcal";
dailyWater.innerHTML=
userData.todayWater+" ml";
dailyWorkout.innerHTML=
userData.workout ? "✅ Done":"❌ Not Done";
bmiInfo.innerHTML=
"BMI : "+userData.bmi+" "+getBMI();
bmrInfo.innerHTML=
"BMR : "+Math.round(userData.bmr)+" kcal/day";
goalInfo.innerHTML=
"Calories Goal : "+userData.calories;
checkAlerts();
}

function getBMI(){
if(userData.bmi<18.5)
return "Underweight";
if(userData.bmi<25)
return "Normal";
if(userData.bmi<30)
return "Overweight";
return "Obesity";
}

// FOOD TRACKER

function addMeal(){
let name=foodName.value;
let cal=Number(foodCalories.value);
if(!name || !cal){
alert("Enter food information");
return;
}
userData.meals.push({
name:name,
calories:cal
});

userData.todayCalories+=cal;
saveData();
displayMeals();
updateDashboard();



foodName.value="";
foodCalories.value="";
}
function displayMeals(){
mealList.innerHTML="";
userData.meals.forEach((m,i)=>{
mealList.innerHTML+=`
<p>
${m.name} : ${m.calories} kcal
<button onclick="deleteMeal(${i})">
❌
</button>
</p>
`;
});
mealTotal.innerHTML=
userData.todayCalories+" kcal";
}
function deleteMeal(i){
userData.todayCalories-=userData.meals[i].calories;
userData.meals.splice(i,1);
saveData();
displayMeals();
updateDashboard();
}

// WATER TRACKER

function addWater(amount){
userData.todayWater+=amount;
if(userData.todayWater>userData.water)
userData.todayWater=userData.water;
saveData();
updateWater();
updateDashboard();
}

function resetWater(){
userData.todayWater=0;
saveData();
updateWater();
updateDashboard();
}
function updateWater(){
waterTotal.innerHTML=
userData.todayWater+" ml";
let percent=0;
if(userData.water>0){
percent=
(userData.todayWater/userData.water)*100;
}
if(percent>100)
percent=100;
waterBar.style.width=
percent+"%";
}

// WORKOUT

function completeWorkout(){
userData.workout=true;
saveData();
updateDashboard();
}

// ALERTS

function checkAlerts(){
let alerts=[];
if(!userData.name){
dailyAlerts.innerHTML=
"Complete your profile first.";
return;
}

if(userData.todayCalories>userData.calories){
alerts.push(
"🔥 Calories limit exceeded"
);
}

if(userData.todayWater<userData.water){
alerts.push(
"💧 Drink more water"
);
}
if(!userData.workout){
alerts.push(
"🏋️ Complete your workout"
);
}

dailyAlerts.innerHTML=
alerts.length?
alerts.join("<br>"):
"✅ Great job today";
}

// HISTORY

function showHistory(){
history.innerHTML="";
if(userData.history.length==0){
history.innerHTML="No history yet";
return;
}
userData.history.forEach(h=>{
history.innerHTML+=`
<p>
📅 ${h.date}<br>
⚖️ ${h.weight} kg<br>
🔥 ${h.calories} kcal<br>
💧 ${h.water} ml
</p>
<hr>
`;
});
}
function saveHistory(){
userData.history.push({
date:new Date().toLocaleDateString(),
weight:userData.weight,
calories:userData.todayCalories,
water:userData.todayWater
});
saveData();
}

// DARK MODE

function toggleDark(){
document.body.classList.toggle("dark");
localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);
}
if(localStorage.getItem("dark")=="true")
document.body.classList.add("dark");

// DELETE DATA

function clearData(){
if(confirm("Delete all data?")){
localStorage.removeItem("healthUser");
location.reload();
}
}

// START

window.onload=function(){
showPage("dashboard");
displayMeals();
updateWater();
if(userData.name){
welcome.innerHTML=
"Welcome "+userData.name+" 👋";
updateDashboard();
}
todayDate.innerHTML=
new Date().toDateString();
};