let firstname = document.getElementById("fname");
let lastname = document.getElementById("lname");
let birthDate = document.getElementById("dof");
let fanimal = document.getElementById("favAnimal");
let cities = document.querySelectorAll('input[name="cities"]');
let regx = RegExp('^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$');
let output = document.getElementById("display_area");
let btn = document.getElementById("removebtn");

// check date validation 
// NOTE: m (as month) is in base 0
const is_valid = (d, m, y) => {
    const mon_31 = [0, 2, 4, 6, 7, 9, 11];
    const mon_30 = [3, 5, 8, 10];
    if(m >= 0 && m <= 11 && y > 0){
        if(mon_31.includes(m)){
            return d >= 1 && d <= 31;
        }else if(mon_30.includes(m)){
            return d >= 1 && d <= 30;
        }else{
            if(y%4 === 0){
                return d >= 1 && d <= 29;
            }else{
                return d >= 1 && d <= 28;
            }
        }
    }
}

// Function to display correct content at textarea. 
const render = (event) => {
    event.preventDefault();
    const fname_val = firstname.value;
    const lname_val = lastname.value;
    const dof_val = birthDate.value;
    if(fname_val.length < 3 || fname_val.length > 50){
        output.value = "Do not enter an invalid firstname";
    }else if(lname_val.length < 3 || lname_val.length > 50){
        output.value = "Do not enter an invalid lastname";
    }else if (!regx.test(dof_val)){
        output.value = "Do not enter an invalid date of birth";
    }else{
        const user_day = parseInt(dof_val.split('/')[0]);
        const user_mon = parseInt(dof_val.split('/')[1])-1;
        const user_year = parseInt(dof_val.split('/')[2]);
        const birthday = new Date(user_year, user_mon, user_day);
        const cur_date = new Date();
        if(is_valid(user_day, user_mon, user_year) && birthday <= cur_date){
            
            let age = cur_date.getFullYear() - birthday.getFullYear();
            var diff_m = cur_date.getMonth() - birthday.getMonth();
            if (diff_m < 0 || (diff_m === 0 && cur_date.getDate() < birthday.getDate())) {
                age--;
            }
            const city_checkboxes = document.querySelectorAll('input[name="cities"]:checked');
            let res = `Hello ${fname_val} ${lname_val}, you are ${age} years old, your favourite cheese is ${fanimal.value} and you\'ve lived in `;
            if(city_checkboxes.length === 0){
                res = res + 'no cities'
            }else{
                city_checkboxes.forEach((city) => {
                    res = res + city.value + ", "
                })
                res = res.substring(0, res.length-2);
            }
            output.value = res; 
        }else{
            output.value = "Do not enter an invalid date of birth";
        }
    }
    
};

// Sections for action triggering
firstname.addEventListener('blur', render);
lastname.addEventListener('blur', render);
birthDate.addEventListener('blur', render);
fanimal.addEventListener('change', render);
cities.forEach((city) => {
    city.addEventListener("change", render);
});
btn.addEventListener('click', ()=>{
    firstname.value = '';
    lastname.value = '';
    birthDate.value = '';
    output.value = '';
    fanimal.selectedIndex = 0;
    cities.forEach((city) => {
        city.checked = false;
    });
});