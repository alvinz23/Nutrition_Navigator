const URL2 = 'https://trackapi.nutritionix.com/v2/search/instant';
const headers = {
  'Content-Type': 'application/json',
  'x-app-id': "ab265269",
  'x-app-key': "a6d0021eb1ef02e5d661b8c2065347f9",
  'x-remote-user-id': 0,
};

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const ATTR_ID_MAP = {
  203: 'Protein',
  204: 'Total Fat',
  208: 'Calories',
  269: 'Total Sugars'
};
let data;

function getSelectedNutrients(nutrients) {
  const selectedNutrients = {};
  for (const nutrient of nutrients) {
    if (ATTR_ID_MAP[nutrient.attr_id]) {
      selectedNutrients[ATTR_ID_MAP[nutrient.attr_id]] = nutrient.value;
    }
  }
  return selectedNutrients;
}

async function fetchRestaurantData(query) {
  const params = {
    query: query,
    self: true,
    branded: true,
    common: true,
    detailed: true,
  };
  try {
    const response = await axios.post(URL2, params, {
      headers,
    });
    if(response.data.branded.length===0){
      const tryagain = document.createElement('div');
      tryagain.setAttribute('class',"tryagain")
      tryagain.textContent="No Results Found, Try Again"
      main.appendChild(tryagain);
    }
    return response.data.branded;
  } catch (error) {
    console.error('Error fetching data from Nutritionix API', error);
    throw error;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    const data = await fetchRestaurantData(searchItem);
    data.forEach(item => {
      const nutrients = getSelectedNutrients(item.full_nutrients);
      
      const foodRow = document.createElement('div');
      foodRow.setAttribute('class', 'row');
  
      const foodColumn = document.createElement('div');
      foodColumn.setAttribute('class', 'column');
  
      const foodCard = document.createElement('div');
      foodCard.setAttribute('class', 'food-card');
  
      const foodName = document.createElement('h3');
      foodName.textContent = item.food_name;
  
      const protein = document.createElement('p');
      protein.textContent = `Protein: ${nutrients['Protein'] ?? 'N/A'}g`;
  
      const calories = document.createElement('p');
      calories.textContent = `Calories: ${nutrients['Calories'] ?? 'N/A'}`;
  
      const totalFat = document.createElement('p');
      totalFat.textContent = `Total Fat: ${nutrients['Total Fat'] ?? 'N/A'}g`;
  
      const totalSugars = document.createElement('p');
      totalSugars.textContent = `Total Sugars: ${nutrients['Total Sugars'] ?? 'N/A'}g`;
  
      foodCard.appendChild(foodName);
      foodCard.appendChild(protein);
      foodCard.appendChild(calories);
      foodCard.appendChild(totalFat);
      foodCard.appendChild(totalSugars);
      foodColumn.appendChild(foodCard);
      foodRow.appendChild(foodColumn);
  
      main.appendChild(foodRow);
      const foodCheckbox = document.createElement('input');
      foodCheckbox.type = 'checkbox';
      foodCheckbox.classList.add('food-checkbox');

      foodCheckbox.addEventListener('change', function() {
        updateNutritionalCounter(data); // Pass 'data' into the function
      });
      foodCard.appendChild(foodCheckbox);

    });
    search.value = "";
  }
});

function updateNutritionalCounter(data) {
  let totalProtein = 0;
let totalCalories = 0;
let totalFat = 0;
let totalSugars = 0;


  // Collect all checkboxes
  const checkboxes = document.querySelectorAll('.food-checkbox');
  
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      // Assume the data array still holds the items
      const nutrients = getSelectedNutrients(data[index].full_nutrients);
      totalProtein += nutrients['Protein'] || 0;
      totalCalories += nutrients['Calories'] || 0;
      totalFat += nutrients['Total Fat'] || 0;
      totalSugars += nutrients['Total Sugars'] || 0;
    }
  });
  document.getElementById("p").innerText = `Protein: ${totalProtein}`;
  document.getElementById("pcal").innerText = `Calories: ${totalCalories}`;
  document.getElementById("pfat").innerText = `Total Fat: ${totalFat}`;
  document.getElementById("psugar").innerText = `Total Sugars: ${totalSugars}`;

}

